import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Copy, Plane, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { desktopTimesheetGrid, mobileTimesheetDays, timesheetTotals } from '@/components/app/mock-data';

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`rounded-[24px] border border-slate-200 bg-white shadow-sm shadow-slate-200 xl:rounded-[28px] ${className}`}>{children}</View>;
}

type DayData = ReturnType<typeof buildWeekDays>[number];

type DayStatus = 'completed' | 'draft' | 'not-started';

function parseTimeLabelToMinutes(value: string): number {
  const match = value.match(/(\d+)h\s*(\d+)m/i);
  if (!match) {
    return 0;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatMinutesToTimeLabel(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function getDayStatus(day: DayData): DayStatus {
  if (parseTimeLabelToMinutes(day.total) === 0) {
    return 'not-started';
  }

  return day.key === 'fri' ? 'draft' : 'completed';
}

function getStatusMeta(status: DayStatus) {
  if (status === 'completed') {
    return { label: 'Completed', dot: '#059669', textColor: '#020617', pillBg: '#ecfdf5', pillText: '#047857' };
  }

  if (status === 'draft') {
    return { label: 'Draft', dot: '#f59e0b', textColor: '#020617', pillBg: '#eff6ff', pillText: '#1764ff' };
  }

  return { label: 'Not started', dot: '#94a3b8', textColor: '#64748b', pillBg: '#f1f5f9', pillText: '#64748b' };
}

function DayStatusDot({ color }: { color: string }) {
  return <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function getFullDayLabel(short: string) {
  if (short === 'Mon') return 'Monday';
  if (short === 'Tue') return 'Tuesday';
  if (short === 'Wed') return 'Wednesday';
  if (short === 'Thu') return 'Thursday';
  if (short === 'Fri') return 'Friday';
  if (short === 'Sat') return 'Saturday';
  return 'Sunday';
}

function WeekPickerModal({
  visible,
  onClose,
  weekOffset,
  pickerMonth,
  onChangeMonth,
  onSetPickerMonth,
  onSelectWeek,
}: {
  visible: boolean;
  onClose: () => void;
  weekOffset: number;
  pickerMonth: Date;
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

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable className="absolute inset-0 bg-slate-950/30" onPress={onClose} />
        <View className="w-full max-w-[440px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-300">
          <View className="flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text className="text-lg font-semibold text-slate-950">Choose Week</Text>
              <Text className="mt-1 text-sm text-slate-500">Select a weekly date range</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close week picker"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
              <X size={18} color="#0f172a" />
            </Pressable>
          </View>
          <View className="mt-5 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={() => onChangeMonth(-1)}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white">
              <ChevronLeft size={18} color="#0f172a" />
            </Pressable>
            <Text className="text-base font-semibold text-slate-900">{getMonthLabel(pickerMonth)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={() => onChangeMonth(1)}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white">
              <ChevronRight size={18} color="#0f172a" />
            </Pressable>
          </View>
          <View className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Year</Text>
              <Text className="text-sm font-medium text-slate-500">Jump faster</Text>
            </View>
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
                    className={`min-w-[62px] rounded-xl border px-3 py-2 ${active ? 'border-[#1764ff] bg-blue-50' : 'border-slate-200 bg-white'}`}>
                    <Text className={`text-center text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-700'}`}>{month.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <ScrollView className="mt-5 max-h-[320px]" showsVerticalScrollIndicator={false}>
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
      </View>
    </Modal>
  );
}

function GhostButton({ label, icon, wide = false }: { label: string; icon?: React.ReactNode; wide?: boolean }) {
  return (
    <View className={`flex-row items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 xl:px-5 xl:py-3.5 ${wide ? 'flex-1' : ''}`}>
      {icon}
      <Text className="text-sm font-medium text-slate-800 xl:text-base">{label}</Text>
    </View>
  );
}

// Week navigation helpers

function getWeekMonday(offset: number): Date {
  const today = new Date();
  const dow = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(monday)} - ${fmt(sunday)}, ${sunday.getFullYear()}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getMonthName(monthIndex: number): string {
  return new Date(2026, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' });
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function getWeekOffsetFromMonday(monday: Date): number {
  return Math.round((monday.getTime() - getWeekMonday(0).getTime()) / 604800000);
}

function getWeeksForMonth(date: Date) {
  const monthStart = getMonthStart(date);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const firstWeekMonday = new Date(monthStart);
  const startDow = firstWeekMonday.getDay();
  firstWeekMonday.setDate(firstWeekMonday.getDate() - (startDow === 0 ? 6 : startDow - 1));
  firstWeekMonday.setHours(0, 0, 0, 0);
  const weeks: { offset: number; label: string; range: string }[] = [];

  for (let cursor = new Date(firstWeekMonday); cursor <= monthEnd || weeks.length === 0; cursor.setDate(cursor.getDate() + 7)) {
    const monday = new Date(cursor);
    weeks.push({
      offset: getWeekOffsetFromMonday(monday),
      label: `Week ${getIsoWeekNumber(monday)}`,
      range: formatWeekRange(monday),
    });
  }

  return weeks;
}

function getIsoWeekNumber(date: Date): number {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));

  const firstThursday = new Date(target.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));

  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);
}

function buildWeekDays(monday: Date, weekOffset: number) {
  const SHORTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const KEYS   = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return SHORTS.map((short, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const numericDate = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const mock = weekOffset === 0 ? mobileTimesheetDays[i] : null;
    return {
      key:         KEYS[i],
      short,
      date,
      numericDate,
      total:       mock?.total       ?? '0h 00m',
      hours:       mock?.hours       ?? '0.00',
      overtime:    mock?.overtime    ?? '0.00',
      vacation:    mock?.vacation    ?? '0.00',
      sick:        mock?.sick        ?? '0.00',
      field:       mock?.field       ?? '0.00',
      job:         mock?.job         ?? '',
      description: mock?.description ?? '',
    };
  });
}

function PrimaryButton({ label, icon, wide = false }: { label: string; icon?: React.ReactNode; wide?: boolean }) {
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
  monday,
  weekRange,
  weekOffset,
  onChangeWeek,
  onOpenCalendar,
}: {
  monday: Date;
  weekRange: string;
  weekOffset: number;
  onChangeWeek: (delta: number) => void;
  onOpenCalendar: () => void;
}) {
  const weekNumber = getIsoWeekNumber(monday);

  return (
    <View className="border-b border-slate-200 bg-white px-4 pb-3 pt-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Week {weekNumber}
        {weekOffset === 0 ? ' - Current' : ''}
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
            {weekRange}
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
          const statusMeta = getStatusMeta(getDayStatus(day));
          const active = selectedDayIndex === index;
          return (
            <Pressable
              key={day.key}
              accessibilityRole="button"
              accessibilityLabel={`Select ${day.short}, ${day.date}`}
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
                {day.numericDate}
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

function MobileSelectedDayForm({
  day,
}: {
  day: DayData;
}) {
  const fieldWorked = Number(day.field) > 0;

  return (
    <SectionCard className="p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[22px] font-semibold tracking-tight text-slate-950">
          {getFullDayLabel(day.short)}, {day.date}
        </Text>
        <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: getStatusMeta(getDayStatus(day)).pillBg }}>
          <Text className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: getStatusMeta(getDayStatus(day)).pillText }}>
            {getStatusMeta(getDayStatus(day)).label}
          </Text>
        </View>
      </View>

      <View className="-mx-1.5 mt-6 flex-row flex-wrap">
        <FormField label="Hours" value={day.hours} />
        <FormField label="Overtime" value={day.overtime} />
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
        <FormField label="Vacation" value={day.vacation} />
        <FormField label="Sick" value={day.sick} />
        <FormField label="Job #" value={day.job} numeric={false} />
        <View className="w-full px-1.5 pt-1">
          <Text className="text-sm font-semibold text-slate-700">What did you work on?</Text>
          <TextInput
            defaultValue={day.description}
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
  weekOffset,
  onChangeWeek,
}: {
  weekOffset: number;
  onChangeWeek: (delta: number) => void;
}) {
  const monday = getWeekMonday(weekOffset);
  const weekRange = formatWeekRange(monday);
  const days = buildWeekDays(monday, weekOffset);
  const { width } = useWindowDimensions();
  const compactFooterLabels = width < 430;
  const totalHoursLabel = compactFooterLabels ? 'Total' : 'Total Hours';
  const copyButtonLabel = compactFooterLabels ? 'Copy Prev.' : 'Copy Prev. Week';
  const submitButtonLabel = compactFooterLabels ? 'Submit' : 'Submit Week';
  const weekTotalLabel = formatMinutesToTimeLabel(days.reduce((sum, day) => sum + parseTimeLabelToMinutes(day.total), 0));
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weekPickerVisible, setWeekPickerVisible] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(getMonthStart(monday));
  const selectedDay = days[selectedDayIndex] ?? days[0];

  function changeWeek(delta: number) {
    setSelectedDayIndex(0);
    onChangeWeek(delta);
  }

  function selectWeek(offset: number) {
    setSelectedDayIndex(0);
    onChangeWeek(offset - weekOffset);
    setPickerMonth(getMonthStart(getWeekMonday(offset)));
    setWeekPickerVisible(false);
  }

  return (
    <View className="flex-1 lg:hidden">
      <View className="flex-1">
        <MobileWeekHeader
          monday={monday}
          weekRange={weekRange}
          weekOffset={weekOffset}
          onChangeWeek={changeWeek}
          onOpenCalendar={() => {
            setPickerMonth(getMonthStart(monday));
            setWeekPickerVisible(true);
          }}
        />

        <MobileDayCards days={days} selectedDayIndex={selectedDayIndex} onSelectDay={setSelectedDayIndex} />

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

type DesktopTimesheetRow = (typeof desktopTimesheetGrid)[number];

function getDesktopRowStatus(row: DesktopTimesheetRow): DayStatus {
  const total = Number(row.hours) + Number(row.overtime);
  if (total === 0) {
    return 'not-started';
  }

  return row.day === 'Fri' ? 'draft' : 'completed';
}

function formatDesktopRowTotal(row: DesktopTimesheetRow) {
  return `${(Number(row.hours) + Number(row.overtime)).toFixed(2)}h`;
}

function hasFieldWork(row: DesktopTimesheetRow) {
  return Number(row.field) > 0;
}

function DesktopTimesheets({
  weekOffset,
  onChangeWeek,
}: {
  weekOffset: number;
  onChangeWeek: (delta: number) => void;
}) {
  const topRowFieldMeta = [
    { key: 'hours', label: 'Hours' },
    { key: 'overtime', label: 'Overtime' },
  ] as const;
  const bottomRowFieldMeta = [
    { key: 'vacation', label: 'Vacation' },
    { key: 'sick', label: 'Sick' },
    { key: 'job', label: 'Job #' },
  ] as const;
  const monday = getWeekMonday(weekOffset);
  const weekRange = formatWeekRange(monday);
  const weekNumber = getIsoWeekNumber(monday);
  const [selectedDay, setSelectedDay] = useState('Fri');
  const [weekPickerVisible, setWeekPickerVisible] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(getMonthStart(monday));
  const activeRow = desktopTimesheetGrid.find((row) => row.day === selectedDay) ?? desktopTimesheetGrid[0];

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
                Week {weekNumber}
                {weekOffset === 0 ? ' - Current' : ''}
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
                  onPress={() => {
                    setPickerMonth(getMonthStart(monday));
                    setWeekPickerVisible(true);
                  }}
                  className="flex-row items-center gap-2.5 rounded-2xl px-2 py-1">
                  <CalendarDays size={20} color="#0f172a" />
                  <Text className="text-[19px] font-semibold tracking-tight text-slate-950 xl:text-[21px]">{weekRange}</Text>
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
              {desktopTimesheetGrid.map((row) => {
                const statusMeta = getStatusMeta(getDesktopRowStatus(row));
                const active = row.day === activeRow.day;
                return (
                  <Pressable
                    key={row.day}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${row.day}, ${row.date}`}
                    onPress={() => setSelectedDay(row.day)}
                    className="min-w-0 flex-1 items-center px-2 py-4">
                    <Text className={`text-center text-[14px] font-semibold uppercase tracking-[0.08em] ${active ? 'text-[#1764ff]' : 'text-slate-900'}`}>
                      {row.day}
                    </Text>
                    <Text className={`mt-2.5 text-center text-[15px] font-medium ${active ? 'text-[#1764ff]' : 'text-slate-500'}`}>{row.date}</Text>
                    <View className="mt-4 flex-row items-center justify-center gap-2">
                      <Text className="text-[17px] font-semibold text-slate-950">{formatDesktopRowTotal(row)}</Text>
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
                {activeRow.day === 'Fri' ? 'Friday' : activeRow.day === 'Thu' ? 'Thursday' : activeRow.day === 'Wed' ? 'Wednesday' : activeRow.day === 'Tue' ? 'Tuesday' : activeRow.day === 'Mon' ? 'Monday' : activeRow.day === 'Sat' ? 'Saturday' : 'Sunday'}, {activeRow.date}
              </Text>
              <View className="flex-row items-center gap-2">
                <Check size={20} color="#22c55e" />
                <Text className="text-[15px] font-medium text-emerald-500">Saved just now</Text>
              </View>
            </View>

            <View className="-mx-3 mt-8 flex-row flex-wrap">
              {topRowFieldMeta.map((field) => (
                <View key={field.key} className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                  <DesktopReadOnlyField label={field.label} sublabel={field.sublabel} value={activeRow[field.key]} />
                </View>
              ))}
              <View className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                <DesktopCheckboxField label="Field" checked={hasFieldWork(activeRow)} />
              </View>
              {bottomRowFieldMeta.map((field) => (
                <View key={field.key} className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                  <DesktopReadOnlyField label={field.label} sublabel={field.sublabel} value={activeRow[field.key]} />
                </View>
              ))}
              <View className="w-full px-3">
                <DesktopReadOnlyField label="What did you work on?" value={activeRow.details} wide />
              </View>
            </View>
          </SectionCard>

          <SectionCard className="mt-4 px-6 py-5 xl:px-8 xl:py-6">
            <View className="flex-row flex-wrap items-center gap-y-5">
              <View className="pr-6">
                <Text className="text-[16px] font-semibold leading-8 text-slate-950 xl:text-[18px]">Weekly{"\n"}totals</Text>
              </View>
              {[
                [timesheetTotals.hours, 'Hours'],
                [timesheetTotals.overtime, 'OT Hours'],
                [timesheetTotals.vacation, 'Vacation'],
                [timesheetTotals.sick, 'Sick'],
                [timesheetTotals.field, 'Field'],
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

      <WeekPickerModal
        visible={weekPickerVisible}
        onClose={() => setWeekPickerVisible(false)}
        weekOffset={weekOffset}
        pickerMonth={pickerMonth}
        onChangeMonth={(delta) => setPickerMonth((current) => addMonths(current, delta))}
        onSetPickerMonth={setPickerMonth}
        onSelectWeek={(offset) => {
          onChangeWeek(offset - weekOffset);
          setPickerMonth(getMonthStart(getWeekMonday(offset)));
          setWeekPickerVisible(false);
        }}
      />
    </View>
  );
}

export default function TimesheetsScreen() {
  const [weekOffset, setWeekOffset] = useState(0);

  function changeWeek(delta: number) {
    setWeekOffset((w) => w + delta);
  }

  return (
    <View className="flex-1 bg-slate-100">
      <MobileTimesheets weekOffset={weekOffset} onChangeWeek={changeWeek} />
      <DesktopTimesheets weekOffset={weekOffset} onChangeWeek={changeWeek} />
    </View>
  );
}
