import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Copy, Plane, Trash2 } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { SectionCard } from '@/components/timesheets/section-card';
import { WeekPickerModal } from '@/components/timesheets/week-picker-modal';
import { addMonths, getMonthStart, getWeekMonday } from '@/lib/timesheets/date-utils';
import { getMockTimesheetWeek } from '@/lib/timesheets/mock-adapter';
import { getDayStatus, getStatusMeta } from '@/lib/timesheets/status-utils';
import type { DayStatus, TimesheetDay, TimesheetWeek } from '@/types/timesheets';

type DayData = TimesheetDay;

function DayStatusDot({ color }: { color: string }) {
  return <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function GhostButton({ label, icon, wide = false }: { label: string; icon?: ReactNode; wide?: boolean }) {
  return (
    <View className={`flex-row items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 xl:px-5 xl:py-3.5 ${wide ? 'flex-1' : ''}`}>
      {icon}
      <Text className="text-sm font-medium text-slate-800 xl:text-base">{label}</Text>
    </View>
  );
}

function PrimaryButton({ label, icon, wide = false }: { label: string; icon?: ReactNode; wide?: boolean }) {
  return (
    <View className={`flex-row items-center justify-center gap-2.5 rounded-2xl bg-[#1764ff] px-4 py-3 xl:px-5 xl:py-3.5 ${wide ? 'flex-1' : ''}`}>
      {icon}
      <Text className="text-sm font-semibold text-white xl:text-base">{label}</Text>
    </View>
  );
}

function FormField({
  label,
  value,
  numeric = true,
  wide = false,
}: {
  label: string;
  value: string;
  numeric?: boolean;
  wide?: boolean;
}) {
  return (
    <View className={wide ? 'w-full' : 'w-1/2 min-w-0'}>
      <View className={wide ? '' : 'px-1.5'}>
        <Text className="text-sm font-semibold text-slate-700">{label}</Text>
        <TextInput
          defaultValue={numeric ? (value === '0.00' ? '' : value) : value}
          inputMode={numeric ? 'decimal' : 'text'}
          keyboardType={numeric ? 'decimal-pad' : 'default'}
          placeholder={numeric ? '0' : ''}
          placeholderTextColor="#94a3b8"
          returnKeyType="done"
          className="mt-2 rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"
        />
      </View>
    </View>
  );
}

function MobileWeekHeader({
  week,
  onChangeWeek,
  onOpenCalendar,
}: {
  week: TimesheetWeek;
  onChangeWeek: (delta: number) => void;
  onOpenCalendar: () => void;
}) {
  return (
    <View className="border-b border-slate-200 bg-white px-4 pb-3 pt-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Week {week.weekNumber}
        {week.weekOffset === 0 ? ' - Current' : ''}
      </Text>
      <View className="mt-2.5 flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous week"
          onPress={() => onChangeWeek(-1)}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <ChevronLeft size={21} color="#0f172a" />
        </Pressable>
        <View className="min-w-0 flex-1 items-center justify-center px-1">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            className="w-full text-center text-[21px] font-semibold tracking-tight text-slate-950">
            {week.range}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose week from calendar"
            onPress={onOpenCalendar}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <CalendarDays size={20} color="#0f172a" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next week"
            onPress={() => onChangeWeek(1)}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <ChevronRight size={21} color="#0f172a" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function MobileDayCards({
  days,
  selectedDayIndex,
  onSelectDay,
}: {
  days: DayData[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}) {
  return (
    <View className="border-b border-slate-200 bg-white px-3 pb-2 pt-1">
      <View className="flex-row">
        {days.map((day, index) => {
          const statusMeta = getStatusMeta(getDayStatus(day.mobile));
          const active = selectedDayIndex === index;
          return (
            <Pressable
              key={day.key}
              accessibilityRole="button"
              accessibilityLabel={`Select ${day.short}, ${day.mobile.date}`}
              onPress={() => onSelectDay(index)}
              className="min-w-0 flex-1 items-center px-1 py-3">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                className={`text-center text-[11px] font-semibold uppercase tracking-[0.06em] ${active ? 'text-[#1764ff]' : 'text-slate-900'}`}>
                {day.short}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                className={`mt-1 text-center text-[11px] font-medium ${active ? 'text-[#1764ff]' : 'text-slate-500'}`}>
                {day.mobile.numericDate}
              </Text>
              <View className="mt-2 items-center">
                <DayStatusDot color={statusMeta.dot} />
              </View>
              <View className={`mt-2 h-0.5 w-full rounded-full ${active ? 'bg-[#1764ff]' : 'bg-transparent'}`} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MobileSelectedDayForm({ day }: { day: DayData }) {
  const mobileDay = day.mobile;
  const fieldWorked = Number(mobileDay.field) > 0;

  return (
    <SectionCard className="p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[22px] font-semibold tracking-tight text-slate-950">
          {day.full}, {mobileDay.date}
        </Text>
        <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: getStatusMeta(getDayStatus(mobileDay)).pillBg }}>
          <Text className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: getStatusMeta(getDayStatus(mobileDay)).pillText }}>
            {getStatusMeta(getDayStatus(mobileDay)).label}
          </Text>
        </View>
      </View>

      <View className="-mx-1.5 mt-6 flex-row flex-wrap">
        <FormField label="Hours" value={mobileDay.hours} />
        <FormField label="Overtime" value={mobileDay.overtime} />
        <View className="w-1/2 min-w-0 px-1.5">
          <Text className="text-sm font-semibold text-slate-700">Field</Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: fieldWorked }}
            className={`mt-2 h-[44px] flex-row items-center rounded-[18px] border px-4 ${
              fieldWorked ? 'border-[#1764ff] bg-blue-50' : 'border-slate-200 bg-white'
            }`}>
            <View
              className={`h-5 w-5 items-center justify-center rounded-md border ${
                fieldWorked ? 'border-[#1764ff] bg-[#1764ff]' : 'border-slate-300 bg-white'
              }`}>
              {fieldWorked ? <Check size={13} color="#fff" /> : null}
            </View>
            <Text className={`ml-3 text-sm font-medium ${fieldWorked ? 'text-[#1764ff]' : 'text-slate-600'}`}>
              {fieldWorked ? 'Worked in field' : 'No field work'}
            </Text>
          </Pressable>
        </View>
        <FormField label="Vacation" value={mobileDay.vacation} />
        <FormField label="Sick" value={mobileDay.sick} />
        <FormField label="Job #" value={mobileDay.job} numeric={false} />
        <View className="w-full px-1.5 pt-1">
          <Text className="text-sm font-semibold text-slate-700">What did you work on?</Text>
          <TextInput
            defaultValue={mobileDay.description}
            multiline
            placeholder="What did you work on?"
            placeholderTextColor="#94a3b8"
            returnKeyType="done"
            scrollEnabled={false}
            textAlignVertical="top"
            className="mt-2 min-h-[120px] rounded-[18px] border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700"
          />
        </View>
      </View>
    </SectionCard>
  );
}

function MobileTimesheets({
  week,
  selectedDayKey,
  onSelectDay,
  onChangeWeek,
  onOpenCalendar,
}: {
  week: TimesheetWeek;
  selectedDayKey: DayData['key'];
  onSelectDay: (key: DayData['key']) => void;
  onChangeWeek: (delta: number) => void;
  onOpenCalendar: () => void;
}) {
  const { width } = useWindowDimensions();
  const days = week.days;
  const compactFooterLabels = width < 430;
  const totalHoursLabel = compactFooterLabels ? 'Total' : 'Total Hours';
  const copyButtonLabel = compactFooterLabels ? 'Copy Prev.' : 'Copy Prev. Week';
  const submitButtonLabel = compactFooterLabels ? 'Submit' : 'Submit Week';
  const weekTotalLabel = week.totals.mobileTotal;
  const selectedDayIndex = Math.max(days.findIndex((day) => day.key === selectedDayKey), 0);
  const selectedDay = days[selectedDayIndex] ?? days[0];

  return (
    <View className="flex-1 lg:hidden">
      <View className="flex-1">
        <MobileWeekHeader week={week} onChangeWeek={onChangeWeek} onOpenCalendar={onOpenCalendar} />

        <MobileDayCards
          days={days}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={(index) => {
            const nextDay = days[index];
            if (nextDay) {
              onSelectDay(nextDay.key);
            }
          }}
        />

        <View className="flex-1">
          <ScrollView
            className="flex-1"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, paddingTop: 12 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
            {selectedDay ? <MobileSelectedDayForm day={selectedDay} /> : null}
          </ScrollView>
        </View>

        <View className="border-t border-slate-200 bg-white px-4 py-2.5">
          <View className="flex-row items-center gap-2">
            <View className="min-w-0 flex-1 flex-row items-center gap-2 px-0.5 py-1">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Clock3 size={19} color="#1764ff" />
              </View>
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="text-xs font-medium text-slate-400">
                  {totalHoursLabel}
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                  className="mt-0.5 text-[15px] font-semibold text-slate-950">
                  {weekTotalLabel}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              className="min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <Copy size={15} color="#1764ff" />
              <Text numberOfLines={1} className="text-sm font-semibold text-slate-900">{copyButtonLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1764ff] px-3 py-3">
              <Plane size={15} color="#fff" />
              <Text numberOfLines={1} className="text-sm font-semibold text-white">{submitButtonLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function DesktopReadOnlyField({ label, sublabel, value, wide = false }: { label: string; sublabel?: string; value: string; wide?: boolean }) {
  return (
    <View className={wide ? 'w-full' : 'min-w-[180px] flex-1'}>
      <Text className="text-sm font-semibold text-slate-700 xl:text-base">{label}</Text>
      {sublabel ? <Text className="mt-1 text-xs text-slate-400 xl:text-sm">{sublabel}</Text> : null}
      <TextInput
        editable={false}
        value={value}
        className="mt-2 rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 xl:px-3.5 xl:py-3 xl:text-[15px]"
      />
    </View>
  );
}

function DesktopCheckboxField({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View className="min-w-[180px] flex-1">
      <Text className="text-sm font-semibold text-slate-700 xl:text-base">{label}</Text>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
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
          {checked ? 'Worked in field' : 'No field work'}
        </Text>
      </Pressable>
    </View>
  );
}

function getDesktopRowStatus(day: DayData): DayStatus {
  const total = Number(day.desktop.hours) + Number(day.desktop.overtime);
  if (total === 0) {
    return 'not-started';
  }

  return day.short === 'Fri' ? 'draft' : 'completed';
}

function formatDesktopRowTotal(day: DayData) {
  return day.desktop.total;
}

function hasFieldWork(day: DayData) {
  return Number(day.desktop.field) > 0;
}

function DesktopTimesheets({
  week,
  selectedDayKey,
  onSelectDay,
  onChangeWeek,
  onOpenCalendar,
}: {
  week: TimesheetWeek;
  selectedDayKey: DayData['key'];
  onSelectDay: (key: DayData['key']) => void;
  onChangeWeek: (delta: number) => void;
  onOpenCalendar: () => void;
}) {
  const topRowFieldMeta: { key: 'hours' | 'overtime'; label: string; sublabel?: string }[] = [
    { key: 'hours', label: 'Hours' },
    { key: 'overtime', label: 'Overtime' },
  ];
  const bottomRowFieldMeta: { key: 'vacation' | 'sick' | 'job'; label: string; sublabel?: string }[] = [
    { key: 'vacation', label: 'Vacation' },
    { key: 'sick', label: 'Sick' },
    { key: 'job', label: 'Job #' },
  ];
  const activeRow = week.days.find((day) => day.key === selectedDayKey) ?? week.days[0];

  return (
    <View className="hidden flex-1 bg-slate-100 lg:flex">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 32 }} showsVerticalScrollIndicator>
        <View className="w-full self-center xl:w-[94%] 2xl:w-[92%]">
          <View className="min-w-0">
            <Text className="text-[20px] font-semibold tracking-tight text-slate-950 xl:text-[24px] 2xl:text-[26px]">Timesheets</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500 xl:text-[15px] 2xl:text-base">Submit and manage your weekly timesheets</Text>
          </View>

          <SectionCard className="mt-6 overflow-hidden">
            <View className="border-b border-slate-100 px-6 py-4 xl:px-8 xl:py-4.5">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Week {week.weekNumber}
                {week.weekOffset === 0 ? ' - Current' : ''}
              </Text>
              <View className="mt-3 flex-row items-center justify-center gap-4">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Previous week"
                  onPress={() => onChangeWeek(-1)}
                  className="h-10 w-10 items-center justify-center rounded-[18px] border border-slate-200 bg-white">
                  <ChevronLeft size={20} color="#0f172a" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Choose week from calendar"
                  onPress={onOpenCalendar}
                  className="flex-row items-center gap-2.5 rounded-2xl px-2 py-1">
                  <CalendarDays size={20} color="#0f172a" />
                  <Text className="text-[19px] font-semibold tracking-tight text-slate-950 xl:text-[21px]">{week.range}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Next week"
                  onPress={() => onChangeWeek(1)}
                  className="h-10 w-10 items-center justify-center rounded-[18px] border border-slate-200 bg-white">
                  <ChevronRight size={20} color="#0f172a" />
                </Pressable>
              </View>
            </View>

            <View className="border-t border-slate-100 px-3 pb-3 pt-2">
              <View className="flex-row">
                {week.days.map((day) => {
                  const statusMeta = getStatusMeta(getDesktopRowStatus(day));
                  const active = day.short === activeRow.short;
                  return (
                    <Pressable
                      key={day.key}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${day.short}, ${day.desktop.date}`}
                      onPress={() => onSelectDay(day.key)}
                      className="min-w-0 flex-1 items-center px-2 py-4">
                      <Text className={`text-center text-[14px] font-semibold uppercase tracking-[0.08em] ${active ? 'text-[#1764ff]' : 'text-slate-900'}`}>
                        {day.short}
                      </Text>
                      <Text className={`mt-2.5 text-center text-[15px] font-medium ${active ? 'text-[#1764ff]' : 'text-slate-500'}`}>{day.desktop.date}</Text>
                      <View className="mt-4 flex-row items-center justify-center gap-2">
                        <Text className="text-[17px] font-semibold text-slate-950">{formatDesktopRowTotal(day)}</Text>
                        <DayStatusDot color={statusMeta.dot} />
                      </View>
                      <View className={`mt-4 h-0.5 w-full rounded-full ${active ? 'bg-[#1764ff]' : 'bg-transparent'}`} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </SectionCard>

          <SectionCard className="mt-4 p-6 xl:p-8">
            <View className="flex-row items-center justify-between gap-4">
              <Text className="text-[22px] font-semibold tracking-tight text-slate-950 xl:text-[24px]">
                {activeRow.full}, {activeRow.desktop.date}
              </Text>
              <View className="flex-row items-center gap-2">
                <Check size={20} color="#22c55e" />
                <Text className="text-[15px] font-medium text-emerald-500">Saved just now</Text>
              </View>
            </View>

            <View className="-mx-3 mt-8 flex-row flex-wrap">
              {topRowFieldMeta.map((field) => (
                <View key={field.key} className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                  <DesktopReadOnlyField label={field.label} sublabel={field.sublabel} value={activeRow.desktop[field.key]} />
                </View>
              ))}
              <View className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                <DesktopCheckboxField label="Field" checked={hasFieldWork(activeRow)} />
              </View>
              {bottomRowFieldMeta.map((field) => (
                <View key={field.key} className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                  <DesktopReadOnlyField label={field.label} sublabel={field.sublabel} value={activeRow.desktop[field.key]} />
                </View>
              ))}
              <View className="w-full px-3">
                <DesktopReadOnlyField label="What did you work on?" value={activeRow.desktop.description} wide />
              </View>
            </View>
          </SectionCard>

          <SectionCard className="mt-4 px-6 py-5 xl:px-8 xl:py-6">
            <View className="flex-row flex-wrap items-center gap-y-5">
              <View className="pr-6">
                <Text className="text-[16px] font-semibold leading-8 text-slate-950 xl:text-[18px]">Weekly{"\n"}totals</Text>
              </View>
              {[
                [week.totals.hours, 'Hours'],
                [week.totals.overtime, 'OT Hours'],
                [week.totals.vacation, 'Vacation'],
                [week.totals.sick, 'Sick'],
                [week.totals.field, 'Field'],
              ].map(([value, label]) => (
                <View key={label} className="border-l border-slate-100 px-5">
                  <Text className="text-[16px] font-semibold text-slate-950 xl:text-[18px]">{value}</Text>
                  <Text className="mt-1.5 text-sm text-slate-400">{label}</Text>
                </View>
              ))}
              <View className="ml-auto flex-row flex-wrap items-center gap-3">
                <GhostButton label="Copy last week" icon={<Copy size={18} color="#334155" />} />
                <GhostButton label="Clear week" icon={<Trash2 size={18} color="#ef4444" />} />
                <PrimaryButton label="Submit timesheet" icon={<Plane size={18} color="#fff" />} />
              </View>
            </View>
          </SectionCard>
        </View>
      </ScrollView>
    </View>
  );
}

export function TimesheetsContainer() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayKey, setSelectedDayKey] = useState<DayData['key']>(() => (isDesktop ? 'fri' : 'mon'));
  const monday = getWeekMonday(weekOffset);
  const week = getMockTimesheetWeek(monday, weekOffset);
  const [weekPickerVisible, setWeekPickerVisible] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(getMonthStart(monday));

  function changeWeek(delta: number) {
    if (!isDesktop) {
      setSelectedDayKey('mon');
    }
    setWeekOffset((current) => current + delta);
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
    setPickerMonth(getMonthStart(getWeekMonday(offset)));
    setWeekPickerVisible(false);
  }

  return (
    <View className="flex-1 bg-slate-100">
      <MobileTimesheets
        week={week}
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onChangeWeek={changeWeek}
        onOpenCalendar={openWeekPicker}
      />
      <DesktopTimesheets
        week={week}
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onChangeWeek={changeWeek}
        onOpenCalendar={openWeekPicker}
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
