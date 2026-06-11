import { useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { DesktopTimesheetsView } from '@/components/timesheets/desktop-timesheets-view';
import { MobileTimesheetsView } from '@/components/timesheets/mobile-timesheets-view';
import { WeekPickerModal } from '@/components/timesheets/week-picker-modal';
import { addMonths, getMonthStart, getWeekMonday } from '@/lib/timesheets/date-utils';
import { getMockTimesheetWeek } from '@/lib/timesheets/mock-adapter';
import { copyTimesheetDayEntry, parseDecimal, syncTimesheetWeek, clearTimesheetDayEntry } from '@/lib/timesheets/week-state';
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
  const initialDayKeyRef = useRef<DayData['key']>(isDesktop ? 'fri' : 'mon');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState<DayData['key']>(initialDayKeyRef.current);
  const [weeksByOffset, setWeeksByOffset] = useState<WeeksByOffset>(() => ({ 0: createWeek(0) }));
  const [weekPickerVisible, setWeekPickerVisible] = useState(false);
  const monday = getWeekMonday(weekOffset);
  const [pickerMonth, setPickerMonth] = useState(getMonthStart(monday));

  const week = useMemo(() => weeksByOffset[weekOffset] ?? createWeek(weekOffset), [weekOffset, weeksByOffset]);

  useEffect(() => {
    const currentMonday = getWeekMonday(0);
    setWeekOffset(0);
    setSelectedDayKey(initialDayKeyRef.current);
    setWeeksByOffset({ 0: createWeek(0) });
    setWeekPickerVisible(false);
    setPickerMonth(getMonthStart(currentMonday));
  }, []);

  function loadWeek(offset: number) {
    setWeeksByOffset((current) => ensureWeek(current, offset));
    setWeekOffset(offset);
  }

  function changeWeek(delta: number) {
    if (!isDesktop) {
      setSelectedDayKey('mon');
    }
    const nextOffset = weekOffset + delta;
    loadWeek(nextOffset);
    setWeekPickerVisible(false);
  }

  function openWeekPicker() {
    setPickerMonth(getMonthStart(monday));
    setWeekPickerVisible((current) => !current);
  }

  function selectWeek(offset: number) {
    if (!isDesktop) {
      setSelectedDayKey('mon');
    }
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
    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'draft',
        days: currentWeek.days.map((day) => {
          if (day.key !== dayKey) {
            return day;
          }

          const checked = parseDecimal(day.entry.field) > 0;
          const nextFieldValue = checked ? '0.00' : parseDecimal(day.entry.hours) > 0 ? day.entry.hours : '1.00';

          return {
            ...day,
            entry: {
              ...day.entry,
              field: nextFieldValue,
            },
          };
        }),
      })
    );
  }

  function copyLastWeek() {
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
    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'draft',
        days: currentWeek.days.map(clearTimesheetDayEntry),
      })
    );
  }

  function submitTimesheet() {
    updateCurrentWeek((currentWeek) =>
      syncTimesheetWeek({
        ...currentWeek,
        status: 'submitted',
      })
    );
    setWeekPickerVisible(false);
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
