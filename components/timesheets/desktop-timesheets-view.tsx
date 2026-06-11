import { CalendarDays, Check, ChevronLeft, ChevronRight, Copy, Plane, Trash2, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { SectionCard } from '@/components/timesheets/section-card';
import { getMonthLabel, getMonthName, getWeeksForMonth } from '@/lib/timesheets/date-utils';
import { getDayStatus, getStatusMeta } from '@/lib/timesheets/status-utils';
import type { TimesheetDay, TimesheetDayField, TimesheetWeek } from '@/types/timesheets';

type DayData = TimesheetDay;

function DayStatusDot({ color }: { color: string }) {
  return <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function getNumericDisplayValue(value: string) {
  return value === '' || value === '0' || value === '0.00' ? '' : value;
}

function GhostButton({
  label,
  icon,
  onPress,
  wide = false,
}: {
  label: string;
  icon?: ReactNode;
  onPress?: () => void;
  wide?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 xl:px-5 xl:py-3.5 ${wide ? 'flex-1' : ''}`}>
      {icon}
      <Text className="text-sm font-medium text-slate-800 xl:text-base">{label}</Text>
    </Pressable>
  );
}

function PrimaryButton({
  label,
  icon,
  onPress,
  wide = false,
}: {
  label: string;
  icon?: ReactNode;
  onPress?: () => void;
  wide?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center justify-center gap-2.5 rounded-2xl bg-[#1764ff] px-4 py-3 xl:px-5 xl:py-3.5 ${wide ? 'flex-1' : ''}`}>
      {icon}
      <Text className="text-sm font-semibold text-white xl:text-base">{label}</Text>
    </Pressable>
  );
}

function DesktopField({
  label,
  value,
  onChangeText,
  numeric = true,
  wide = false,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  numeric?: boolean;
  wide?: boolean;
}) {
  return (
    <View className={wide ? 'w-full' : 'min-w-[180px] flex-1'}>
      <Text className="text-sm font-semibold text-slate-700 xl:text-base">{label}</Text>
      <TextInput
        value={numeric ? getNumericDisplayValue(value) : value}
        onChangeText={onChangeText}
        inputMode={numeric ? 'decimal' : 'text'}
        keyboardType={numeric ? 'numeric' : 'default'}
        placeholder={numeric ? '0' : ''}
        placeholderTextColor="#94a3b8"
        className="mt-2 rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 xl:px-3.5 xl:py-3 xl:text-[15px]"
      />
    </View>
  );
}

function DesktopCheckboxField({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) {
  return (
    <View className="min-w-[180px] flex-1">
      <Text className="text-sm font-semibold text-slate-700 xl:text-base">{label}</Text>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={onPress}
        className={`mt-2 h-[44px] flex-row items-center rounded-[18px] border px-4 ${
          checked ? 'border-[#1764ff] bg-blue-50' : 'border-slate-200 bg-white'
        }`}>
        <View
          className={`h-5 w-5 items-center justify-center rounded-md border ${
            checked ? 'border-[#1764ff] bg-[#1764ff]' : 'border-slate-300 bg-white'
          }`}>
          {checked ? <Check size={13} color="#fff" /> : null}
        </View>
        <Text className={`ml-3 text-sm font-medium ${checked ? 'text-[#1764ff]' : 'text-slate-600'}`}>
          {checked ? 'Yes' : 'No'}
        </Text>
      </Pressable>
    </View>
  );
}

function formatDesktopRowTotal(day: DayData) {
  return day.totals.desktop;
}

function hasFieldWork(day: DayData) {
  return Number(day.entry.field) > 0;
}

function DesktopSummaryMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View className="w-[132px] shrink-0 border-l border-slate-100 px-4 py-3">
      <Text className="text-[17px] font-semibold text-slate-950 xl:text-[18px]">{value}</Text>
      <Text className="mt-1.5 text-[14px] font-medium text-slate-500 xl:text-[15px]">{label}</Text>
    </View>
  );
}

function DesktopWeekPickerPopover({
  weekOffset,
  pickerMonth,
  onClose,
  onChangeMonth,
  onSetPickerMonth,
  onSelectWeek,
}: {
  weekOffset: number;
  pickerMonth: Date;
  onClose: () => void;
  onChangeMonth: (delta: number) => void;
  onSetPickerMonth: (date: Date) => void;
  onSelectWeek: (offset: number) => void;
}) {
  const weekOptions = getWeeksForMonth(pickerMonth);
  const pickerYear = pickerMonth.getFullYear();
  const pickerMonthIndex = pickerMonth.getMonth();
  const yearOptions = Array.from({ length: 5 }, (_, index) => pickerYear - 2 + index);
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: getMonthName(index),
  }));
  const { height } = useWindowDimensions();
  const popoverMaxHeight = Math.max(520, height - 96);
  const weekListMaxHeight = Math.max(220, popoverMaxHeight - 360);

  return (
    <View
      className="absolute right-0 top-full z-[80] mt-3 w-[420px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-300"
      style={{ maxHeight: popoverMaxHeight }}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-base font-semibold text-slate-950">Choose week</Text>
          <Text className="mt-1 text-sm text-slate-500">Jump by year or month, then choose the exact week range.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close week picker"
          onPress={onClose}
          className="h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <X size={16} color="#0f172a" />
        </Pressable>
      </View>

      <View className="mt-4 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => onChangeMonth(-1)}
          className="h-9 w-9 items-center justify-center rounded-xl bg-white">
          <ChevronLeft size={18} color="#0f172a" />
        </Pressable>
        <View className="items-center px-3">
          <Text className="text-sm font-semibold text-slate-900">{getMonthLabel(pickerMonth)}</Text>
          <Text className="mt-0.5 text-xs text-slate-500">Browse nearby months</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => onChangeMonth(1)}
          className="h-9 w-9 items-center justify-center rounded-xl bg-white">
          <ChevronRight size={18} color="#0f172a" />
        </Pressable>
      </View>

      <View className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Year</Text>

        <View className="mt-3 flex-row gap-2">
          {yearOptions.map((year) => {
            const active = year === pickerYear;
            return (
              <Pressable
                key={year}
                accessibilityRole="button"
                onPress={() => onSetPickerMonth(new Date(year, pickerMonthIndex, 1))}
                className={`flex-1 rounded-xl border px-2 py-2.5 ${active ? 'border-[#1764ff] bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <Text className={`text-center text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-700'}`}>{year}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Month</Text>
        <View className="mt-3 flex-row flex-wrap gap-2">
          {monthOptions.map((month) => {
            const active = month.value === pickerMonthIndex;
            return (
              <Pressable
                key={month.value}
                accessibilityRole="button"
                onPress={() => onSetPickerMonth(new Date(pickerYear, month.value, 1))}
                className={`min-w-[70px] rounded-xl border px-3 py-2 ${active ? 'border-[#1764ff] bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <Text className={`text-center text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-700'}`}>{month.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView className="mt-4" style={{ maxHeight: weekListMaxHeight }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <View className="gap-2">
          {weekOptions.map((option) => {
            const active = option.offset === weekOffset;
            return (
              <Pressable
                key={option.offset}
                accessibilityRole="button"
                onPress={() => onSelectWeek(option.offset)}
                className={`rounded-2xl border px-4 py-3 ${active ? 'border-[#1764ff] bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <Text className={`text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-900'}`}>{option.label}</Text>
                <Text className={`mt-1 text-sm ${active ? 'text-[#1764ff]' : 'text-slate-500'}`}>{option.range}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export function DesktopTimesheetsView({
  week,
  selectedDayKey,
  onSelectDay,
  onChangeWeek,
  isWeekPickerOpen,
  onOpenCalendar,
  onCloseCalendar,
  pickerMonth,
  weekOffset,
  onChangePickerMonth,
  onSetPickerMonth,
  onSelectWeek,
  onUpdateDayField,
  onToggleFieldWork,
  onCopyLastWeek,
  onClearWeek,
  onSubmitTimesheet,
}: {
  week: TimesheetWeek;
  selectedDayKey: DayData['key'];
  onSelectDay: (key: DayData['key']) => void;
  onChangeWeek: (delta: number) => void;
  isWeekPickerOpen: boolean;
  onOpenCalendar: () => void;
  onCloseCalendar: () => void;
  pickerMonth: Date;
  weekOffset: number;
  onChangePickerMonth: (delta: number) => void;
  onSetPickerMonth: (date: Date) => void;
  onSelectWeek: (offset: number) => void;
  onUpdateDayField: (dayKey: DayData['key'], field: TimesheetDayField, value: string) => void;
  onToggleFieldWork: (dayKey: DayData['key']) => void;
  onCopyLastWeek: () => void;
  onClearWeek: () => void;
  onSubmitTimesheet: () => void;
}) {
  const topRowFieldMeta: { key: 'hours' | 'overtime'; label: string }[] = [
    { key: 'hours', label: 'Hours' },
    { key: 'overtime', label: 'Overtime' },
  ];
  const bottomRowFieldMeta: { key: 'vacation' | 'sick' | 'job'; label: string }[] = [
    { key: 'vacation', label: 'Vacation' },
    { key: 'sick', label: 'Sick' },
    { key: 'job', label: 'Job #' },
  ];
  const activeRow = week.days.find((day) => day.key === selectedDayKey) ?? week.days[0];
  const weekStatusClasses =
    week.status === 'submitted'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-blue-200 bg-blue-50 text-[#1764ff]';

  return (
    <View className="hidden min-h-0 flex-1 bg-slate-100 lg:flex">
      <View className="relative min-h-0 flex-1 px-6 py-6">
        <View className="min-h-0 flex-1">
          <View className="flex-row items-start justify-between gap-5">
            <View className="min-w-0 flex-1">
              <Text className="text-[20px] font-semibold tracking-tight text-slate-950 xl:text-[24px] 2xl:text-[26px]">Timesheets</Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500 xl:text-[15px] 2xl:text-base">
                Review the week, edit one day at a time, and submit when everything looks right.
              </Text>
            </View>
            <View className={`rounded-full border px-4 py-2 ${weekStatusClasses}`}>
              <Text className="text-xs font-semibold uppercase tracking-[0.14em]">
                {week.status === 'submitted' ? 'Submitted' : 'Draft'}
              </Text>
            </View>
          </View>

          {isWeekPickerOpen ? <Pressable className="absolute inset-0 z-[45]" onPress={onCloseCalendar} /> : null}

          <SectionCard className="relative z-[50] mt-6 overflow-visible px-6 py-5 xl:px-8 xl:py-6">
            <View className="flex-row items-center justify-between gap-6">
              <View className="min-w-0 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Week {week.weekNumber}
                  {week.weekOffset === 0 ? ' - Current' : ''}
                </Text>
                <Text className="mt-2 text-[24px] font-semibold tracking-tight text-slate-950 xl:text-[28px]">{week.range}</Text>
              </View>
              <View className="relative z-[50] flex-row items-center gap-3">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Previous week"
                  onPress={() => onChangeWeek(-1)}
                  className="h-11 w-11 items-center justify-center rounded-[18px] border border-slate-200 bg-white">
                  <ChevronLeft size={20} color="#0f172a" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Choose week from calendar"
                  onPress={onOpenCalendar}
                  className="flex-row items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <CalendarDays size={18} color="#0f172a" />
                  <Text className="text-sm font-semibold text-slate-900">Browse weeks</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Next week"
                  onPress={() => onChangeWeek(1)}
                  className="h-11 w-11 items-center justify-center rounded-[18px] border border-slate-200 bg-white">
                  <ChevronRight size={20} color="#0f172a" />
                </Pressable>

                {isWeekPickerOpen ? (
                  <DesktopWeekPickerPopover
                    weekOffset={weekOffset}
                    pickerMonth={pickerMonth}
                    onClose={onCloseCalendar}
                    onChangeMonth={onChangePickerMonth}
                    onSetPickerMonth={onSetPickerMonth}
                    onSelectWeek={onSelectWeek}
                  />
                ) : null}
              </View>
            </View>
          </SectionCard>

          <View className="mt-4 min-h-0 flex-1 gap-4 xl:flex-row xl:items-stretch">
            <SectionCard className="min-h-0 overflow-hidden px-0 py-0 xl:w-[300px] 2xl:w-[320px]">
              <View className="border-b border-slate-100 px-5 py-4">
                <Text className="text-sm font-semibold text-slate-950">Week at a glance</Text>
                <Text className="mt-1 text-sm text-slate-500">Select a day to edit its details.</Text>
              </View>
              <View className="min-h-0 flex-1">
                {week.days.map((day) => {
                  const statusMeta = getStatusMeta(getDayStatus(day, week.status));
                  const active = day.key === activeRow.key;
                  return (
                    <Pressable
                      key={day.key}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${day.short}, ${day.desktop.date}`}
                      onPress={() => onSelectDay(day.key)}
                      className={`flex-1 border-b border-slate-100 px-5 py-4 ${active ? 'bg-blue-50' : 'bg-white'}`}>
                      <View className="flex-row items-center justify-between gap-4">
                        <View className="min-w-0 flex-1">
                          <Text className={`text-[14px] font-semibold uppercase tracking-[0.08em] ${active ? 'text-[#1764ff]' : 'text-slate-900'}`}>
                            {day.short}
                          </Text>
                          <Text className={`mt-1.5 text-[15px] font-medium ${active ? 'text-[#1764ff]' : 'text-slate-500'}`}>{day.desktop.date}</Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-[17px] font-semibold text-slate-950">{formatDesktopRowTotal(day)}</Text>
                          <View className="mt-2 flex-row items-center gap-2">
                            <Text className="text-xs font-medium text-slate-500">{statusMeta.label}</Text>
                            <DayStatusDot color={statusMeta.dot} />
                          </View>
                        </View>
                      </View>
                      <View className={`mt-4 h-0.5 w-full rounded-full ${active ? 'bg-[#1764ff]' : 'bg-transparent'}`} />
                    </Pressable>
                  );
                })}
              </View>
            </SectionCard>

            <SectionCard className="min-h-0 flex-1 p-6 xl:p-7">
              <View className="flex-row items-center justify-between gap-4">
                <View className="min-w-0 flex-1">
                  <Text className="text-[22px] font-semibold tracking-tight text-slate-950 xl:text-[24px]">
                    {activeRow.full}, {activeRow.desktop.date}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">Update hours, classifications, and notes for this day.</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Check size={20} color="#22c55e" />
                  <Text className="text-[15px] font-medium text-emerald-500">Saved just now</Text>
                </View>
              </View>

              <View className="-mx-3 mt-6 flex-row flex-wrap">
                {topRowFieldMeta.map((field) => (
                  <View key={field.key} className="mb-5 w-1/2 min-w-[260px] px-3 2xl:w-1/3">
                    <DesktopField label={field.label} value={activeRow.entry[field.key]} onChangeText={(value) => onUpdateDayField(activeRow.key, field.key, value)} />
                  </View>
                ))}
                <View className="mb-5 w-1/2 min-w-[260px] px-3 2xl:w-1/3">
                  <DesktopCheckboxField label="Field" checked={hasFieldWork(activeRow)} onPress={() => onToggleFieldWork(activeRow.key)} />
                </View>
                {bottomRowFieldMeta.map((field) => (
                  <View key={field.key} className="mb-5 w-1/2 min-w-[260px] px-3 2xl:w-1/3">
                    <DesktopField
                      label={field.label}
                      value={activeRow.entry[field.key]}
                      numeric={field.key !== 'job'}
                      onChangeText={(value) => onUpdateDayField(activeRow.key, field.key, value)}
                    />
                  </View>
                ))}
                <View className="w-full px-3">
                  <DesktopField
                    label="What did you work on?"
                    value={activeRow.entry.description}
                    numeric={false}
                    wide
                    onChangeText={(value) => onUpdateDayField(activeRow.key, 'description', value)}
                  />
                </View>
              </View>
            </SectionCard>
          </View>

          <SectionCard className="mt-4 shrink-0 overflow-hidden px-0 py-0">
            <View className="flex-row items-center px-4">
              <View className="py-3 pr-4">
                <View className="flex-row items-center gap-2 rounded-full bg-emerald-50 px-3 py-2">
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-white">
                    <Check size={11} color="#16a34a" />
                  </View>
                  <Text className="text-[14px] font-semibold text-emerald-700">Saved</Text>
                </View>
              </View>

              <View className="min-w-0 flex-1 flex-row items-center">
                <DesktopSummaryMetric
                  value={week.totals.hours}
                  label="Hours"
                />
                <DesktopSummaryMetric
                  value={week.totals.overtime}
                  label="Overtime"
                />
                <DesktopSummaryMetric value={week.totals.vacation} label="Vacation" />
                <DesktopSummaryMetric value={week.totals.sick} label="Sick" />
                <DesktopSummaryMetric value={week.totals.field} label="Field" />
              </View>

              <View className="ml-auto border-l border-slate-100 pl-4">
                <View className="flex-row items-center gap-3 py-3">
                  <GhostButton label="Copy last week" icon={<Copy size={18} color="#334155" />} onPress={onCopyLastWeek} />
                  <GhostButton label="Clear week" icon={<Trash2 size={18} color="#ef4444" />} onPress={onClearWeek} />
                  <PrimaryButton label="Submit timesheet" icon={<Plane size={18} color="#fff" />} onPress={onSubmitTimesheet} />
                </View>
              </View>
            </View>
          </SectionCard>
        </View>
      </View>
    </View>
  );
}
