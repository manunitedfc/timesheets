import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Copy, Plane } from 'lucide-react-native';
import { Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { SectionCard } from '@/components/timesheets/section-card';
import { getDayStatus, getStatusMeta } from '@/lib/timesheets/status-utils';
import type { TimesheetDay, TimesheetDayField, TimesheetWeek } from '@/types/timesheets';

type DayData = TimesheetDay;

function DayStatusDot({ color }: { color: string }) {
  return <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function FormField({
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
    <View className={wide ? 'w-full' : 'w-1/2 min-w-0'}>
      <View className={wide ? '' : 'px-1.5'}>
        <Text className="text-sm font-semibold text-slate-700">{label}</Text>
        <TextInput
          value={numeric ? (value === '0.00' ? '' : value) : value}
          onChangeText={onChangeText}
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

function MobileSelectedDayForm({
  day,
  onUpdateDayField,
  onToggleFieldWork,
}: {
  day: DayData;
  onUpdateDayField: (dayKey: DayData['key'], field: TimesheetDayField, value: string) => void;
  onToggleFieldWork: (dayKey: DayData['key']) => void;
}) {
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
        <FormField label="Hours" value={mobileDay.hours} onChangeText={(value) => onUpdateDayField(day.key, 'hours', value)} />
        <FormField label="Overtime" value={mobileDay.overtime} onChangeText={(value) => onUpdateDayField(day.key, 'overtime', value)} />
        <View className="w-1/2 min-w-0 px-1.5">
          <Text className="text-sm font-semibold text-slate-700">Field</Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: fieldWorked }}
            onPress={() => onToggleFieldWork(day.key)}
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
              {fieldWorked ? 'Yes' : 'No'}
            </Text>
          </Pressable>
        </View>
        <FormField label="Vacation" value={mobileDay.vacation} onChangeText={(value) => onUpdateDayField(day.key, 'vacation', value)} />
        <FormField label="Sick" value={mobileDay.sick} onChangeText={(value) => onUpdateDayField(day.key, 'sick', value)} />
        <FormField label="Job #" value={mobileDay.job} numeric={false} onChangeText={(value) => onUpdateDayField(day.key, 'job', value)} />
        <View className="w-full px-1.5 pt-1">
          <Text className="text-sm font-semibold text-slate-700">What did you work on?</Text>
          <TextInput
            value={mobileDay.description}
            onChangeText={(value) => onUpdateDayField(day.key, 'description', value)}
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

export function MobileTimesheetsView({
  week,
  selectedDayKey,
  onSelectDay,
  onChangeWeek,
  onOpenCalendar,
  onUpdateDayField,
  onToggleFieldWork,
}: {
  week: TimesheetWeek;
  selectedDayKey: DayData['key'];
  onSelectDay: (key: DayData['key']) => void;
  onChangeWeek: (delta: number) => void;
  onOpenCalendar: () => void;
  onUpdateDayField: (dayKey: DayData['key'], field: TimesheetDayField, value: string) => void;
  onToggleFieldWork: (dayKey: DayData['key']) => void;
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
            {selectedDay ? (
              <MobileSelectedDayForm day={selectedDay} onUpdateDayField={onUpdateDayField} onToggleFieldWork={onToggleFieldWork} />
            ) : null}
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
              <Text numberOfLines={1} className="text-sm font-semibold text-slate-900">
                {copyButtonLabel}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1764ff] px-3 py-3">
              <Plane size={15} color="#fff" />
              <Text numberOfLines={1} className="text-sm font-semibold text-white">
                {submitButtonLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
