import type { DayStatus, DayStatusMeta, TimesheetDay } from '@/types/timesheets';

export function parseTimeLabelToMinutes(value: string): number {
  const match = value.match(/(\d+)h\s*(\d+)m/i);
  if (!match) {
    return 0;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatMinutesToTimeLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

export function getDayStatus(day: TimesheetDay): DayStatus {
  if (parseTimeLabelToMinutes(day.total) === 0) {
    return 'not-started';
  }

  return day.key === 'fri' ? 'draft' : 'completed';
}

export function getStatusMeta(status: DayStatus): DayStatusMeta {
  if (status === 'completed') {
    return { label: 'Completed', dot: '#059669', textColor: '#020617', pillBg: '#ecfdf5', pillText: '#047857' };
  }

  if (status === 'draft') {
    return { label: 'Draft', dot: '#f59e0b', textColor: '#020617', pillBg: '#eff6ff', pillText: '#1764ff' };
  }

  return { label: 'Not started', dot: '#94a3b8', textColor: '#64748b', pillBg: '#f1f5f9', pillText: '#64748b' };
}
