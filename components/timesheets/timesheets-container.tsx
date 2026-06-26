import { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { DesktopTimesheetsView } from '@/components/timesheets/desktop-timesheets-view';
import { MobileTimesheetsView } from '@/components/timesheets/mobile-timesheets-view';
import { WeekPickerModal } from '@/components/timesheets/week-picker-modal';
import { addMonths, getMonthStart, getWeekMonday } from '@/lib/timesheets/date-utils';
import { getMockTimesheetWeek } from '@/lib/timesheets/mock-adapter';
import { copyTimesheetDayEntry, syncTimesheetWeek, clearTimesheetDayEntry } from '@/lib/timesheets/week-state';
import type { TimesheetDay, TimesheetDayField, TimesheetWeek } from '@/types/timesheets';

type DayData = TimesheetDay;
type WeeksByOffset = Record<number, TimesheetWeek>;

function normalizeFieldValue(field: TimesheetDayField, value: string) {
  if (field === 'job' || field === 'description') {
    return value;
  }

  if (value === '') {
    return '';
  }

  return /^\d*\.?\d*$/.test(value) ? value : value.slice(0, -1);
}

function createWeek(offset: number) {
  return getMockTimesheetWeek(getWeekMonday(offset), offset);
}

function ensureWeek(map: WeeksByOffset, offset: number) {
  if (map[offset]) {
    return map;
  }

  return {
    ...map,
    [offset]: createWeek(offset),
  };
}

export function TimesheetsContainer() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const initialDayKey: DayData['key'] = 'mon';
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState<DayData['key']>(initialDayKey);
  const [weeksByOffset, setWeeksByOffset] = useState<WeeksByOffset>(() => ({ 0: createWeek(0) }));
  const [weekPickerVisible, setWeekPickerVisible] = useState(false);
  const monday = getWeekMonday(weekOffset);
  const [pickerMonth, setPickerMonth] = useState(getMonthStart(monday));

  const week = useMemo(() => weeksByOffset[weekOffset] ?? createWeek(weekOffset), [weekOffset, weeksByOffset]);
  const isCurrentWeekSubmitted = week.status === 'submitted';

  useEffect(() => {
    const currentMonday = getWeekMonday(0);
    setWeekOffset(0);
    setSelectedDayKey(initialDayKey);
    setWeeksByOffset({ 0: createWeek(0) });
    setWeekPickerVisible(false);
    setPickerMonth(getMonthStart(currentMonday));
  }, []);

  function loadWeek(offset: number) {
    setWeeksByOffset((current) => ensureWeek(current, offset));
    setWeekOffset(offset);
  }

  function changeWeek(delta: number) {
    setSelectedDayKey(initialDayKey);
    const nextOffset = weekOffset + delta;
    loadWeek(nextOffset);
    setWeekPickerVisible(false);
  }

  function openWeekPicker() {
    setPickerMonth(getMonthStart(monday));
    setWeekPickerVisible((current) => !current);
  }

  function selectWeek(offset: number) {
    setSelectedDayKey(initialDayKey);
    loadWeek(offset);
    setPickerMonth(getMonthStart(getWeekMonday(offset)));
    setWeekPickerVisible(false);
  }

  function updateCurrentWeek(updater: (currentWeek: TimesheetWeek) => TimesheetWeek) {
    setWeeksByOffset((current) => {
      const currentWeek = current[weekOffset] ?? createWeek(weekOffset);
      return {
        ...current,
        [weekOffset]: updater(currentWeek),
      };
    });
  }

  function updateDayField(dayKey: DayData['key'], field: TimesheetDayField, value: string) {
    if (isCurrentWeekSubmitted) {
      return;
    }

    const nextValue = normalizeFieldValue(field, value);

    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'draft',
        days: currentWeek.days.map((day) => {
          if (day.key !== dayKey) {
            return day;
          }

          return {
            ...day,
            entry: {
              ...day.entry,
              [field]: nextValue,
            },
          };
        }),
      })
    );
  }

  function toggleFieldWork(dayKey: DayData['key']) {
    if (isCurrentWeekSubmitted) {
      return;
    }

    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'draft',
        days: currentWeek.days.map((day) => {
          if (day.key !== dayKey) {
            return day;
          }

          return {
            ...day,
            entry: {
              ...day.entry,
              field: !day.entry.field,
            },
          };
        }),
      })
    );
  }

  function copyLastWeek() {
    if (isCurrentWeekSubmitted) {
      return;
    }

    const previousWeek = weeksByOffset[weekOffset - 1] ?? createWeek(weekOffset - 1);
    setWeeksByOffset((current) => ensureWeek(current, weekOffset - 1));

    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'draft',
        days: currentWeek.days.map((day, index) => copyTimesheetDayEntry(day, previousWeek.days[index] ?? day)),
      })
    );
  }

  function clearWeek() {
    if (isCurrentWeekSubmitted) {
      return;
    }

    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'draft',
        days: currentWeek.days.map(clearTimesheetDayEntry),
      })
    );
  }

  function submitTimesheet() {
    if (isCurrentWeekSubmitted) {
      return;
    }

    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'submitted',
      })
    );
    setWeekPickerVisible(false);
  }

  return (
    <View className="flex-1 bg-slate-100 dark:bg-slate-950">
      <MobileTimesheetsView
        week={week}
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onChangeWeek={changeWeek}
        onOpenCalendar={openWeekPicker}
        onUpdateDayField={updateDayField}
        onToggleFieldWork={toggleFieldWork}
        onCopyLastWeek={copyLastWeek}
        onSubmitTimesheet={submitTimesheet}
      />
      <DesktopTimesheetsView
        week={week}
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onChangeWeek={changeWeek}
        isWeekPickerOpen={weekPickerVisible}
        onOpenCalendar={openWeekPicker}
        onCloseCalendar={() => setWeekPickerVisible(false)}
        pickerMonth={pickerMonth}
        weekOffset={weekOffset}
        onChangePickerMonth={(delta) => setPickerMonth((current) => addMonths(current, delta))}
        onSetPickerMonth={setPickerMonth}
        onSelectWeek={selectWeek}
        onUpdateDayField={updateDayField}
        onToggleFieldWork={toggleFieldWork}
        onCopyLastWeek={copyLastWeek}
        onClearWeek={clearWeek}
        onSubmitTimesheet={submitTimesheet}
      />
      {!isDesktop ? (
        <WeekPickerModal
          visible={weekPickerVisible}
          onClose={() => setWeekPickerVisible(false)}
          weekOffset={weekOffset}
          pickerMonth={pickerMonth}
          onChangeMonth={(delta) => setPickerMonth((current) => addMonths(current, delta))}
          onSetPickerMonth={setPickerMonth}
          onSelectWeek={selectWeek}
        />
      ) : null}
    </View>
  );
}
