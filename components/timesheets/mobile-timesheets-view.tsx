import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Copy, Plane } from 'lucide-react-native';
import { Platform, Pressable, ScrollView, Text, TextInput, useColorScheme, useWindowDimensions, View } from 'react-native';

import { SectionCard } from '@/components/timesheets/section-card';
import { getDayStatus, getStatusMeta } from '@/lib/timesheets/status-utils';
import type { TimesheetDay, TimesheetDayField, TimesheetWeek } from '@/types/timesheets';

type DayData = TimesheetDay;

function DayStatusDot({ color }: { color: string }) {
  return <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function getNumericDisplayValue(value: string) {
  return value === '' || value === '0' || value === '0.00' ? '' : value;
}

function FormField({
  label,
  value,
  onChangeText,
  numeric = true,
  wide = false,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  numeric?: boolean;
  wide?: boolean;
  editable?: boolean;
}) {
  return (
    <View className={wide ? 'w-full' : 'w-1/2 min-w-0'}>
      <View className={wide ? '' : 'px-1.5'}>
        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</Text>
        <TextInput
          value={numeric ? getNumericDisplayValue(value) : value}
          onChangeText={onChangeText}
          inputMode={numeric ? 'decimal' : 'text'}
          keyboardType={numeric ? 'numeric' : 'default'}
          editable={editable}
          placeholder={numeric ? '0' : ''}
          placeholderTextColor="#94a3b8"
          returnKeyType="done"
          className={`mt-2 rounded-[18px] border border-slate-200 px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:text-slate-50 ${
            editable ? 'bg-white dark:bg-slate-950' : 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-300'
          }`}
        />
      </View>
    </View>
  );
}

function MobileSummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-0 flex-1 px-2 py-1">
      <Text numberOfLines={1} className="text-xs font-medium text-slate-400">
        {label}
      </Text>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} className="mt-0.5 text-sm font-semibold text-slate-950 dark:text-slate-50">
        {value}
      </Text>
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
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor = colorScheme === 'dark' ? '#e2e8f0' : '#0f172a';

  return (
    <View className="border-b border-slate-200 bg-white px-4 pb-3 pt-4 dark:border-slate-800 dark:bg-slate-950">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        Week {week.weekNumber}
        {week.weekOffset === 0 ? ' - Current' : ''}
      </Text>
      <View className="mt-2.5 flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous week"
          onPress={() => onChangeWeek(-1)}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <ChevronLeft size={21} color={iconColor} />
        </Pressable>
        <View className="min-w-0 flex-1 items-center justify-center px-1">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            className="w-full text-center text-[21px] font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {week.range}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose week from calendar"
            onPress={onOpenCalendar}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <CalendarDays size={20} color={iconColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next week"
            onPress={() => onChangeWeek(1)}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <ChevronRight size={21} color={iconColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function MobileDayCards({
  days,
  weekStatus,
  selectedDayIndex,
  onSelectDay,
}: {
  days: DayData[];
  weekStatus: TimesheetWeek['status'];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}) {
  return (
    <View className="border-b border-slate-200 bg-white px-3 pb-2 pt-1 dark:border-slate-800 dark:bg-slate-950">
      <View className="flex-row">
        {days.map((day, index) => {
          const statusMeta = getStatusMeta(getDayStatus(day, weekStatus));
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
                className={`text-center text-[11px] font-semibold uppercase tracking-[0.06em] ${active ? 'text-[#1764ff]' : 'text-slate-900 dark:text-slate-100'}`}>
                {day.short}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                className={`mt-1 text-center text-[11px] font-medium ${active ? 'text-[#1764ff]' : 'text-slate-500 dark:text-slate-400'}`}>
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
  weekStatus,
  onUpdateDayField,
  onToggleFieldWork,
}: {
  day: DayData;
  weekStatus: TimesheetWeek['status'];
  onUpdateDayField: (dayKey: DayData['key'], field: TimesheetDayField, value: string) => void;
  onToggleFieldWork: (dayKey: DayData['key']) => void;
}) {
  const fieldWorked = day.entry.field;
  const statusMeta = getStatusMeta(getDayStatus(day, weekStatus));
  const isSubmitted = weekStatus === 'submitted';

  return (
    <SectionCard className="p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[22px] font-semibold tracking-tight text-slate-950 dark:text-slate-50">
          {day.full}, {day.mobile.date}
        </Text>
        <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: statusMeta.pillBg }}>
          <Text className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: statusMeta.pillText }}>{statusMeta.label}</Text>
        </View>
      </View>

      <View className="-mx-1.5 mt-6 flex-row flex-wrap">
        <FormField label="Hours" value={day.entry.hours} editable={!isSubmitted} onChangeText={(value) => onUpdateDayField(day.key, 'hours', value)} />
        <FormField label="Overtime" value={day.entry.overtime} editable={!isSubmitted} onChangeText={(value) => onUpdateDayField(day.key, 'overtime', value)} />
        <View className="w-1/2 min-w-0 px-1.5">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">Field</Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: fieldWorked, disabled: isSubmitted }}
            disabled={isSubmitted}
            onPress={() => onToggleFieldWork(day.key)}
            className={`mt-2 h-[44px] flex-row items-center rounded-[18px] border px-4 ${
               fieldWorked ? 'border-[#1764ff] bg-blue-50 dark:bg-blue-950/40' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'
            } ${isSubmitted ? 'opacity-70' : ''}`}>
            <View
              className={`h-5 w-5 items-center justify-center rounded-md border ${
                fieldWorked ? 'border-[#1764ff] bg-[#1764ff]' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
              }`}>
              {fieldWorked ? <Check size={13} color="#fff" /> : null}
            </View>
            <Text className={`ml-3 text-sm font-medium ${fieldWorked ? 'text-[#1764ff]' : 'text-slate-600 dark:text-slate-300'}`}>
              {fieldWorked ? 'Yes' : 'No'}
            </Text>
          </Pressable>
        </View>
        <FormField label="Vacation" value={day.entry.vacation} editable={!isSubmitted} onChangeText={(value) => onUpdateDayField(day.key, 'vacation', value)} />
        <FormField label="Sick" value={day.entry.sick} editable={!isSubmitted} onChangeText={(value) => onUpdateDayField(day.key, 'sick', value)} />
        <FormField label="Job #" value={day.entry.job} numeric={false} editable={!isSubmitted} onChangeText={(value) => onUpdateDayField(day.key, 'job', value)} />
        <View className="w-full px-1.5 pt-1">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">What did you work on?</Text>
          <TextInput
            value={day.entry.description}
            onChangeText={(value) => onUpdateDayField(day.key, 'description', value)}
            editable={!isSubmitted}
            multiline
            placeholder="What did you work on?"
            placeholderTextColor="#94a3b8"
            returnKeyType="done"
            scrollEnabled={false}
            textAlignVertical="top"
            className={`mt-2 min-h-[120px] rounded-[18px] border border-slate-200 px-3 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:text-slate-50 ${
              isSubmitted ? 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-300' : 'bg-white dark:bg-slate-950'
            }`}
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
  onCopyLastWeek,
  onSubmitTimesheet,
}: {
  week: TimesheetWeek;
  selectedDayKey: DayData['key'];
  onSelectDay: (key: DayData['key']) => void;
  onChangeWeek: (delta: number) => void;
  onOpenCalendar: () => void;
  onUpdateDayField: (dayKey: DayData['key'], field: TimesheetDayField, value: string) => void;
  onToggleFieldWork: (dayKey: DayData['key']) => void;
  onCopyLastWeek: () => void;
  onSubmitTimesheet: () => void;
}) {
  const { width } = useWindowDimensions();
  const days = week.days;
  const compactFooterLabels = width < 430;
  const totalHoursLabel = compactFooterLabels ? 'Total' : 'Total Hours';
  const copyButtonLabel = compactFooterLabels ? 'Copy Prev.' : 'Copy Prev. Week';
  const submitButtonLabel = compactFooterLabels ? 'Submit' : 'Submit Week';
  const weekTotalLabel = week.totals.mobileTotal;
  const isSubmitted = week.status === 'submitted';
  const selectedDayIndex = Math.max(days.findIndex((day) => day.key === selectedDayKey), 0);
  const selectedDay = days[selectedDayIndex] ?? days[0];

  return (
    <View className="flex-1 lg:hidden">
      <View className="flex-1">
        <MobileWeekHeader week={week} onChangeWeek={onChangeWeek} onOpenCalendar={onOpenCalendar} />

        <MobileDayCards
          days={days}
          weekStatus={week.status}
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
              <MobileSelectedDayForm
                day={selectedDay}
                weekStatus={week.status}
                onUpdateDayField={onUpdateDayField}
                onToggleFieldWork={onToggleFieldWork}
              />
            ) : null}
          </ScrollView>
        </View>

        <View className="border-t border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-950">
          {isSubmitted ? (
            <View className="flex-row items-center gap-3">
              <View className="min-w-[118px] flex-row items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 dark:bg-slate-900">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
                  <Clock3 size={18} color="#1764ff" />
                </View>
                <View className="min-w-0 flex-1">
                  <Text numberOfLines={1} className="text-xs font-medium text-slate-400">
                    {totalHoursLabel}
                  </Text>
                  <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} className="mt-0.5 text-[15px] font-semibold text-slate-950 dark:text-slate-50">
                    {weekTotalLabel}
                  </Text>
                </View>
              </View>
              <View className="min-w-0 flex-1 flex-row">
                <MobileSummaryMetric label="Regular" value={week.totals.hours} />
                <MobileSummaryMetric label="Overtime" value={week.totals.overtime} />
                <MobileSummaryMetric label="Vacation" value={week.totals.vacation} />
                <MobileSummaryMetric label="Sick" value={week.totals.sick} />
              </View>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <View className="min-w-0 flex-1 flex-row items-center gap-2 px-0.5 py-1">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
                    <Clock3 size={18} color="#1764ff" />
                </View>
                <View className="min-w-0 flex-1">
                  <Text numberOfLines={1} className="text-xs font-medium text-slate-400">
                    {totalHoursLabel}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                    className="mt-0.5 text-[15px] font-semibold text-slate-950 dark:text-slate-50">
                    {weekTotalLabel}
                  </Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={onCopyLastWeek}
                className="min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                <Copy size={15} color="#1764ff" />
                <Text numberOfLines={1} className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {copyButtonLabel}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onSubmitTimesheet}
                className="min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#1764ff] px-3 py-2.5">
                <Plane size={15} color="#fff" />
                <Text numberOfLines={1} className="text-sm font-semibold text-white">
                  {submitButtonLabel}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
