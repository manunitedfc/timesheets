import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { DesktopTimesheetsView } from '@/components/timesheets/desktop-timesheets-view';
import { MobileTimesheetsView } from '@/components/timesheets/mobile-timesheets-view';
import { WeekPickerModal } from '@/components/timesheets/week-picker-modal';
import { addMonths, getMonthStart, getWeekMonday } from '@/lib/timesheets/date-utils';
import { getMockTimesheetWeek } from '@/lib/timesheets/mock-adapter';
import { formatMinutesToTimeLabel } from '@/lib/timesheets/status-utils';
import type { TimesheetDay, TimesheetDayField, TimesheetTotals, TimesheetWeek } from '@/types/timesheets';

type DayData = TimesheetDay;

function parseDecimal(value: string): number {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
}

function formatDecimal(value: number): string {
  return value.toFixed(2);
}

function formatDayMinutes(day: DayData): string {
  const totalHours =
    parseDecimal(day.mobile.hours) +
    parseDecimal(day.mobile.overtime) +
    parseDecimal(day.mobile.vacation) +
    parseDecimal(day.mobile.sick);

  return formatMinutesToTimeLabel(Math.round(totalHours * 60));
}

function formatDesktopDayTotal(day: DayData): string {
  const totalHours =
    parseDecimal(day.desktop.hours) +
    parseDecimal(day.desktop.overtime) +
    parseDecimal(day.desktop.vacation) +
    parseDecimal(day.desktop.sick);

  return `${totalHours.toFixed(2)}h`;
}

function recalculateTotals(days: DayData[]): TimesheetTotals {
  const totals = days.reduce(
    (acc, day) => {
      acc.hours += parseDecimal(day.mobile.hours);
      acc.overtime += parseDecimal(day.mobile.overtime);
      acc.vacation += parseDecimal(day.mobile.vacation);
      acc.sick += parseDecimal(day.mobile.sick);
      acc.field += parseDecimal(day.mobile.field);
      return acc;
    },
    { hours: 0, overtime: 0, vacation: 0, sick: 0, field: 0 }
  );

  const totalMinutes = Math.round((totals.hours + totals.overtime + totals.vacation + totals.sick) * 60);

  return {
    hours: formatDecimal(totals.hours),
    overtime: formatDecimal(totals.overtime),
    vacation: formatDecimal(totals.vacation),
    sick: formatDecimal(totals.sick),
    field: formatDecimal(totals.field),
    mobileTotal: formatMinutesToTimeLabel(totalMinutes),
  };
}

function recalculateWeek(week: TimesheetWeek): TimesheetWeek {
  const days = week.days.map((day) => ({
    ...day,
    mobile: {
      ...day.mobile,
      total: formatDayMinutes(day),
    },
    desktop: {
      ...day.desktop,
      total: formatDesktopDayTotal(day),
    },
  }));

  return {
    ...week,
    days,
    totals: recalculateTotals(days),
  };
}

function normalizeFieldValue(field: TimesheetDayField, value: string) {
  if (field === 'job' || field === 'description') {
    return value;
  }

  if (value.trim() === '') {
    return '0.00';
  }

  const numeric = parseDecimal(value);
  return Number.isFinite(numeric) ? value : '0.00';
}

export function TimesheetsContainer() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState<DayData['key']>(() => (isDesktop ? 'fri' : 'mon'));
  const [week, setWeek] = useState<TimesheetWeek>(() => getMockTimesheetWeek(getWeekMonday(0), 0));
  const [weekPickerVisible, setWeekPickerVisible] = useState(false);
  const monday = getWeekMonday(weekOffset);
  const [pickerMonth, setPickerMonth] = useState(getMonthStart(monday));

  function changeWeek(delta: number) {
    if (!isDesktop) {
      setSelectedDayKey('mon');
    }
    const nextOffset = weekOffset + delta;
    setWeekOffset(nextOffset);
    setWeek(recalculateWeek(getMockTimesheetWeek(getWeekMonday(nextOffset), nextOffset)));
  }

  function openWeekPicker() {
    setPickerMonth(getMonthStart(monday));
    setWeekPickerVisible(true);
  }

  function selectWeek(offset: number) {
    if (!isDesktop) {
      setSelectedDayKey('mon');
    }
    setWeekOffset(offset);
    setWeek(recalculateWeek(getMockTimesheetWeek(getWeekMonday(offset), offset)));
    setPickerMonth(getMonthStart(getWeekMonday(offset)));
    setWeekPickerVisible(false);
  }

  function updateDayField(dayKey: DayData['key'], field: TimesheetDayField, value: string) {
    const nextValue = normalizeFieldValue(field, value);

    setWeek((currentWeek) =>
      recalculateWeek({
        ...currentWeek,
        days: currentWeek.days.map((day) => {
          if (day.key !== dayKey) {
            return day;
          }

          if (field === 'description') {
            return {
              ...day,
              mobile: { ...day.mobile, description: nextValue },
              desktop: { ...day.desktop, description: nextValue },
            };
          }

          return {
            ...day,
            mobile: { ...day.mobile, [field]: nextValue },
            desktop: { ...day.desktop, [field]: nextValue },
          };
        }),
      })
    );
  }

  function toggleFieldWork(dayKey: DayData['key']) {
    setWeek((currentWeek) =>
      recalculateWeek({
        ...currentWeek,
        days: currentWeek.days.map((day) => {
          if (day.key !== dayKey) {
            return day;
          }

          const checked = parseDecimal(day.mobile.field) > 0;
          const nextFieldValue = checked ? '0.00' : parseDecimal(day.mobile.hours) > 0 ? day.mobile.hours : '1.00';

          return {
            ...day,
            mobile: { ...day.mobile, field: nextFieldValue },
            desktop: { ...day.desktop, field: nextFieldValue },
          };
        }),
      })
    );
  }

  return (
    <View className="flex-1 bg-slate-100">
      <MobileTimesheetsView
        week={week}
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onChangeWeek={changeWeek}
        onOpenCalendar={openWeekPicker}
        onUpdateDayField={updateDayField}
        onToggleFieldWork={toggleFieldWork}
      />
      <DesktopTimesheetsView
        week={week}
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onChangeWeek={changeWeek}
        onOpenCalendar={openWeekPicker}
        onUpdateDayField={updateDayField}
        onToggleFieldWork={toggleFieldWork}
      />
      <WeekPickerModal
        visible={weekPickerVisible}
        onClose={() => setWeekPickerVisible(false)}
        weekOffset={weekOffset}
        pickerMonth={pickerMonth}
        onChangeMonth={(delta) => setPickerMonth((current) => addMonths(current, delta))}
        onSetPickerMonth={setPickerMonth}
        onSelectWeek={selectWeek}
      />
    </View>
  );
}
