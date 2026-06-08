import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buildBlankWeek, mockWeekEntries } from '@/data/timesheets';
import type {
    TimesheetEntryRow,
    TimesheetPayload,
    TimesheetStatus,
    TimesheetValidationErrors,
} from '@/types';

// ─── helpers ────────────────────────────────────────────────────────────────

function isoMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function weekNumber(iso: string): number {
  const d = new Date(iso);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
}

function formatWeekLabel(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const year = e.getFullYear();
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`.replace(
    String(year),
    String(year)
  );
}

function validate(entries: TimesheetEntryRow[]): TimesheetValidationErrors {
  const errors: TimesheetValidationErrors = {};
  for (const row of entries) {
    const rowErrors: Partial<Record<keyof TimesheetEntryRow, string>> = {};
    if (row.hours < 0) rowErrors.hours = 'Cannot be negative';
    if (row.otHours < 0) rowErrors.otHours = 'Cannot be negative';
    if (row.vacation < 0) rowErrors.vacation = 'Cannot be negative';
    if (row.sick < 0) rowErrors.sick = 'Cannot be negative';
    if (row.fieldHours < 0) rowErrors.fieldHours = 'Cannot be negative';
    if (row.fieldHours > row.hours && row.hours > 0) {
      rowErrors.fieldHours = 'Cannot exceed regular hours';
    }
    if (row.hours + row.otHours > 24) {
      rowErrors.hours = 'Hours + OT cannot exceed 24h';
    }
    if (Object.keys(rowErrors).length > 0) errors[row.date] = rowErrors;
  }
  return errors;
}

// ─── seed data map (keyed by weekStart ISO) ─────────────────────────────────
// In production this would be fetched per week. Here we seed one known week.
const SEED_WEEK = '2025-05-19';

// ─── hook ────────────────────────────────────────────────────────────────────

export function useTimesheet(employeeId = 'emp-001') {
  const todayMonday = isoMonday(new Date());
  const [weekStart, setWeekStart] = useState<string>(todayMonday);
  const [entriesByWeek, setEntriesByWeek] = useState<Record<string, TimesheetEntryRow[]>>(() => {
    const initial: Record<string, TimesheetEntryRow[]> = {
      [todayMonday]: buildBlankWeek(todayMonday),
    };
    // Keep seeded demo data available when navigating to that historical week.
    if (todayMonday !== SEED_WEEK) {
      initial[SEED_WEEK] = mockWeekEntries;
    } else {
      initial[todayMonday] = mockWeekEntries;
    }
    return initial;
  });
  const [statusByWeek, setStatusByWeek] = useState<Record<string, TimesheetStatus>>(() => ({
    [todayMonday]: 'draft',
    ...(todayMonday !== SEED_WEEK ? { [SEED_WEEK]: 'draft' } : {}),
  }));
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [validationErrors, setValidationErrors] = useState<TimesheetValidationErrors>({});

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Current week's data
  const entries = useMemo(
    () => entriesByWeek[weekStart] ?? buildBlankWeek(weekStart),
    [entriesByWeek, weekStart]
  );
  const status = statusByWeek[weekStart] ?? 'draft';
  const weekEnd = addDays(weekStart, 6);
  const weekLabel = formatWeekLabel(weekStart, weekEnd);
  const weekNum = weekNumber(weekStart);
  const isReadOnly = status === 'submitted' || status === 'approved';

  // Totals
  const totals = useMemo(
    () =>
      entries.reduce(
        (acc, row) => ({
          hours: acc.hours + row.hours,
          otHours: acc.otHours + row.otHours,
          vacation: acc.vacation + row.vacation,
          sick: acc.sick + row.sick,
          fieldHours: acc.fieldHours + row.fieldHours,
        }),
        { hours: 0, otHours: 0, vacation: 0, sick: 0, fieldHours: 0 }
      ),
    [entries]
  );

  // Auto-save: debounce 2 seconds after any entry change
  const triggerAutoSave = useCallback(
    (newEntries: TimesheetEntryRow[]) => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        // Replace with your API call: saveDraft(buildPayload(newEntries, 'draft'))
        setLastSavedAt(new Date());
      }, 2000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  // Update a single field in a single row
  const updateEntry = useCallback(
    (date: string, field: keyof TimesheetEntryRow, value: string | number) => {
      if (isReadOnly) return;
      setEntriesByWeek((prev) => {
        const current = prev[weekStart] ?? buildBlankWeek(weekStart);
        const updated = current.map((row) =>
          row.date === date ? { ...row, [field]: value } : row
        );
        triggerAutoSave(updated);
        return { ...prev, [weekStart]: updated };
      });
      // Clear that field's error on change
      setValidationErrors((prev) => {
        const rowErrors = { ...prev[date] };
        delete rowErrors[field];
        return { ...prev, [date]: rowErrors };
      });
    },
    [isReadOnly, weekStart, triggerAutoSave]
  );

  // Week navigation
  const goPrevWeek = useCallback(() => {
    setWeekStart((prev) => addDays(prev, -7));
    setValidationErrors({});
  }, []);

  const goNextWeek = useCallback(() => {
    setWeekStart((prev) => addDays(prev, 7));
    setValidationErrors({});
  }, []);

  // Copy previous week's entries into current week (dates remapped)
  const copyLastWeek = useCallback(() => {
    const prevWeekStart = addDays(weekStart, -7);
    const prevEntries = entriesByWeek[prevWeekStart];
    if (!prevEntries) return; // nothing to copy
    const copied = prevEntries.map((row, i) => ({
      ...row,
      date: addDays(weekStart, i),
    }));
    setEntriesByWeek((prev) => ({ ...prev, [weekStart]: copied }));
    triggerAutoSave(copied);
  }, [weekStart, entriesByWeek, triggerAutoSave]);

  // Clear current week back to blank
  const clearWeek = useCallback(() => {
    const blank = buildBlankWeek(weekStart);
    setEntriesByWeek((prev) => ({ ...prev, [weekStart]: blank }));
    triggerAutoSave(blank);
    setValidationErrors({});
  }, [weekStart, triggerAutoSave]);

  // Submit
  const submitTimesheet = useCallback(
    (onSubmit?: (payload: TimesheetPayload) => void) => {
      const errors = validate(entries);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return false;
      }
      const payload: TimesheetPayload = {
        weekStart,
        weekEnd,
        weekNumber: weekNum,
        employeeId,
        entries,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };
      setStatusByWeek((prev) => ({ ...prev, [weekStart]: 'submitted' }));
      setLastSavedAt(new Date());
      onSubmit?.(payload);
      return true;
    },
    [entries, weekStart, weekEnd, weekNum, employeeId]
  );

  return {
    // week meta
    weekStart,
    weekEnd,
    weekLabel,
    weekNum,
    status,
    isReadOnly,
    lastSavedAt,
    // data
    entries,
    totals,
    validationErrors,
    // actions
    updateEntry,
    goPrevWeek,
    goNextWeek,
    copyLastWeek,
    clearWeek,
    submitTimesheet,
  };
}
