# Workforce Hub — Database Integration Guide

## Overview

Workforce Hub is a cross-platform timesheet and workforce management application built with **Expo SDK 54**, **Expo Router**, **Gluestack UI**, and **NativeWind**. It runs on iOS, Android, and web from a single codebase.

This document describes the data models, API contracts, and implementation steps required to replace the current mock data with a live backend, including draft saving, timesheet submission, approvals, and time-off management.

---

## Application Screens & Their Data Needs

| Screen | Mobile | Desktop | Data |
|---|---|---|---|
| Dashboard | ✅ | ✅ | Stats, activity feed, team list |
| Timesheets | ✅ | ✅ | Weekly entries, submission status |
| Time Off | ✅ | ✅ | Requests, balances |
| Approvals | — | ✅ | Approval queue |
| Reports | — | ✅ | Aggregated summaries |
| Users | — | ✅ | Employee directory |
| Profile | ✅ | ✅ | Current user info |

---

## Data Models

### `User`
```ts
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  department: string;
  office: string;
  avatarUrl?: string;
};
```

### `TimesheetEntry` (one row per day)
```ts
type TimesheetEntry = {
  id: string;
  timesheetId: string;   // FK → Timesheet
  date: string;          // ISO 8601: "2026-06-08"
  hours: number;
  overtime: number;
  vacation: number;
  sick: number;
  field: number;
  jobNumber?: string;
  description?: string;
};
```

### `Timesheet` (one record per user per week)
```ts
type Timesheet = {
  id: string;
  userId: string;        // FK → User
  weekStart: string;     // ISO 8601: Monday of the week "2026-06-08"
  weekEnd: string;       // ISO 8601: Sunday of the week "2026-06-14"
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;   // FK → User
  rejectionNote?: string;
  entries: TimesheetEntry[];
};
```

### `TimeOffRequest`
```ts
type TimeOffRequest = {
  id: string;
  userId: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
};
```

---

## Timesheet Lifecycle

```
Draft → Submitted → Approved
                 ↘ Rejected → Draft (editable again)
```

- **Draft**: User is actively editing. Auto-saved every 30 seconds or on field blur.
- **Submitted**: User clicked "Submit". Read-only for the employee. Enters the manager's approval queue.
- **Approved**: Manager approved. Locked. Feeds into payroll export.
- **Rejected**: Manager returned it with a note. Employee can edit and re-submit.

---

## API Endpoints

All endpoints are REST/JSON. Replace `https://api.yourcompany.com` with your actual base URL. All requests require a bearer token in the `Authorization` header.

### Timesheets

| Method | Path | Description |
|---|---|---|
| `GET` | `/timesheets?userId=&weekStart=` | Fetch timesheet for a user + week |
| `POST` | `/timesheets` | Create a new draft timesheet |
| `PUT` | `/timesheets/:id` | Update draft entries (auto-save) |
| `POST` | `/timesheets/:id/submit` | Submit timesheet for approval |
| `POST` | `/timesheets/:id/approve` | Manager approves (admin/manager only) |
| `POST` | `/timesheets/:id/reject` | Manager rejects with a note |
| `GET` | `/timesheets/week-summary?weekStart=` | Team summary for a given week |

### Time Off

| Method | Path | Description |
|---|---|---|
| `GET` | `/time-off?userId=` | Fetch all requests for a user |
| `POST` | `/time-off` | Submit a new request |
| `POST` | `/time-off/:id/approve` | Approve request |
| `POST` | `/time-off/:id/reject` | Reject request |

### Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/users` | List all users (admin/manager) |
| `GET` | `/users/me` | Current authenticated user |
| `PATCH` | `/users/:id` | Update user profile |

---

## Replacing Mock Data

All mock data lives in `components/app/mock-data.ts`. The migration path is:

### Step 1 — Add a data-fetching layer

Create `lib/api.ts`:

```ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getAuthToken(); // your auth implementation
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getTimesheet: (userId: string, weekStart: string) =>
    apiFetch<Timesheet>(`/timesheets?userId=${userId}&weekStart=${weekStart}`),

  saveTimesheet: (id: string, entries: TimesheetEntry[]) =>
    apiFetch<Timesheet>(`/timesheets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ entries }),
    }),

  submitTimesheet: (id: string) =>
    apiFetch<Timesheet>(`/timesheets/${id}/submit`, { method: 'POST' }),
};
```

### Step 2 — Add auto-save to the Timesheets screen

In `app/(app)/timesheets.tsx`, replace the static `mobileTimesheetDays` reference:

```ts
// Load
const [timesheet, setTimesheet] = useState<Timesheet | null>(null);

useEffect(() => {
  api.getTimesheet(currentUser.id, weekStart).then(setTimesheet);
}, [weekStart]);

// Auto-save on field change (debounced 30s)
const debouncedSave = useMemo(
  () => debounce((entries: TimesheetEntry[]) => {
    if (timesheet) api.saveTimesheet(timesheet.id, entries);
  }, 30_000),
  [timesheet]
);

// Submit
function handleSubmit() {
  if (timesheet) api.submitTimesheet(timesheet.id).then(setTimesheet);
}
```

### Step 3 — Copy Previous Week

```ts
async function copyPreviousWeek() {
  const prevWeekStart = subtractDays(weekStart, 7);
  const prev = await api.getTimesheet(currentUser.id, prevWeekStart);
  if (!prev) return;

  const copiedEntries = prev.entries.map(e => ({
    ...e,
    id: uuid(),
    timesheetId: timesheet!.id,
    date: shiftDate(e.date, 7), // move each date forward one week
    hours: e.hours,
  }));

  await api.saveTimesheet(timesheet!.id, copiedEntries);
}
```

---

## Draft Auto-Save Strategy

The current UI shows a "last saved" indicator. Implement this with a two-tier save:

| Trigger | Action |
|---|---|
| Field blur | Immediate `PUT /timesheets/:id` |
| 30-second idle | Debounced `PUT /timesheets/:id` |
| App goes to background | Flush any pending save immediately |
| Navigate away | Flush any pending save immediately |

Use `AppState` from React Native to detect background transitions:

```ts
import { AppState } from 'react-native';

useEffect(() => {
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'background') debouncedSave.flush();
  });
  return () => sub.remove();
}, []);
```

---

## Status Badge Colours

The timesheet `status` field maps to visual badges throughout the app:

| Status | Background | Text | Usage |
|---|---|---|---|
| `draft` | `bg-amber-100` | `text-amber-700` | Timesheet in progress |
| `submitted` | `bg-blue-100` | `text-blue-700` | Awaiting approval |
| `approved` | `bg-green-100` | `text-green-700` | Locked & processed |
| `rejected` | `bg-red-100` | `text-red-700` | Needs correction |

---

## Environment Variables

Add to `.env.local` (never commit real values):

```
EXPO_PUBLIC_API_URL=https://api.yourcompany.com/v1
```

Expo automatically exposes variables prefixed with `EXPO_PUBLIC_` to the client bundle.

---

## Recommended Backend Stack

The app is backend-agnostic. Any of the following work:

| Option | Notes |
|---|---|
| **Supabase** | Postgres + auto-generated REST & realtime. Fastest to get running. |
| **PlanetScale / Neon** | Serverless Postgres. Pair with a Next.js API route layer. |
| **Node.js + Prisma** | Full control. Prisma schema maps 1:1 with the models above. |
| **Firebase Firestore** | NoSQL. Works well for mobile but requires denormalisation of entries. |

---

## Security Considerations

- All API calls must be authenticated. Use short-lived JWTs (15 min) with refresh tokens.
- Managers can only approve timesheets belonging to their direct reports.
- Admins have full read/write access across all users.
- Employees can only read/write their own timesheets.
- Submitted and approved timesheets must be **read-only** on the client; enforce this server-side too — do not rely only on the UI.
- Rate-limit the auto-save endpoint to avoid excessive writes (e.g. max 1 write per 10 seconds per user per timesheet).
