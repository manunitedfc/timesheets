import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Pencil,
  Plane,
  Trash2,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { desktopTimesheetGrid, mobileTimesheetDays, timesheetTotals, timesheetWeek } from '@/components/app/mock-data';

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

function SummaryMetric({ label, value, bordered = false }: { label: string; value: string; bordered?: boolean }) {
  return (
    <View className={`min-w-0 flex-1 ${bordered ? 'border-l border-slate-200 pl-3' : ''}`}>
      <Text numberOfLines={2} className="min-h-[22px] text-[9px] font-semibold uppercase leading-3 tracking-[0.1em] text-slate-400">
        {label}
      </Text>
      <Text numberOfLines={1} className="mt-1 text-base font-semibold tracking-tight text-slate-950">
        {value}
      </Text>
    </View>
  );
}

function DayStatusDot({ color }: { color: string }) {
  return <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function DayEditorModal({
  days,
  selectedIndex,
  visible,
  onClose,
  onSelectDay,
  weekRange,
}: {
  days: DayData[];
  selectedIndex: number;
  visible: boolean;
  onClose: () => void;
  onSelectDay: (index: number) => void;
  weekRange: string;
}) {
  const day = days[selectedIndex];

  if (!day) {
    return null;
  }

  function selectDay(index: number) {
    Keyboard.dismiss();
    onSelectDay(index);
  }

  const status = getDayStatus(day);
  const statusMeta = getStatusMeta(status);
  const fields = [
    { label: 'Hours', value: day.hours, numeric: true },
    { label: 'OT Hours', value: day.overtime, numeric: true },
    { label: 'Vacation', value: day.vacation, numeric: true },
    { label: 'Sick', value: day.sick, numeric: true },
    { label: 'Field', value: day.field, numeric: true },
    { label: 'Job #', value: day.job, numeric: false },
  ] as { label: string; value: string; numeric: boolean }[];

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      visible={visible}>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'right', 'bottom', 'left']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
            style={{ flex: 1 }}>
            <View className="bg-white px-4 pb-4 pt-5">
              <View className="flex-row items-center justify-between gap-3">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close day editor"
                  onPress={onClose}
                  className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                  <X size={22} color="#0f172a" />
                </Pressable>
                <View className="min-w-0 flex-1 items-center">
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    className="w-full text-center text-lg font-semibold tracking-tight text-slate-950">
                    {weekRange}
                  </Text>
                </View>
                <View className="h-12 w-12" />
              </View>
            </View>

            <ScrollView
              automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
              className="flex-1"
              contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <SectionCard className="overflow-hidden p-2">
                <View className="flex-row gap-1">
                  {days.map((candidate, index) => {
                    const candidateStatus = getDayStatus(candidate);
                    const candidateMeta = getStatusMeta(candidateStatus);
                    const active = index === selectedIndex;

                    return (
                      <Pressable
                        key={candidate.key}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${candidate.short}, ${candidate.date}`}
                        onPress={() => selectDay(index)}
                        className={`min-w-0 flex-1 items-center rounded-2xl border px-1 py-3 ${
                          active ? 'border-[#1764ff] bg-blue-50' : 'border-transparent bg-white'
                        }`}>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.72}
                          className={`w-full text-center text-sm font-semibold uppercase tracking-[0.08em] ${
                            active ? 'text-[#1764ff]' : 'text-slate-500'
                          }`}>
                          {candidate.short}
                        </Text>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.75}
                          className={`mt-1 w-full text-center text-base font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-950'}`}>
                          {candidate.numericDate}
                        </Text>
                        <View className="mt-2">
                          <DayStatusDot color={candidateMeta.dot} />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </SectionCard>

              <SectionCard className="mt-4 p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Day Total</Text>
                    <Text className="mt-1 text-2xl font-semibold text-slate-950">{day.total}</Text>
                  </View>
                  <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: statusMeta.pillBg }}>
                    <Text
                      className="text-xs font-semibold uppercase tracking-[0.12em]"
                      style={{ color: statusMeta.pillText }}>
                      {statusMeta.label}
                    </Text>
                  </View>
                </View>

                <View className="-mx-1.5 mt-5 flex-row flex-wrap">
                  {fields.map(({ label, value, numeric }) => (
                    <View key={label} className="mb-4 w-1/2 min-w-0 px-1.5">
                      <Text className="text-sm font-semibold text-slate-500">{label}</Text>
                      <TextInput
                        defaultValue={numeric ? (value === '0.00' ? '' : value) : value}
                        inputMode={numeric ? 'decimal' : 'text'}
                        keyboardType={numeric ? 'decimal-pad' : 'default'}
                        placeholder={numeric ? '0' : ''}
                        placeholderTextColor="#94a3b8"
                        returnKeyType="done"
                        className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base font-medium text-slate-900 outline-none"
                      />
                    </View>
                  ))}
                </View>

                <Text className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Description</Text>
                <TextInput
                  defaultValue={day.description}
                  multiline
                  placeholder="What did you work on?"
                  placeholderTextColor="#94a3b8"
                  returnKeyType="done"
                  scrollEnabled={false}
                  textAlignVertical="top"
                  className="mt-1.5 min-h-[140px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base leading-6 text-slate-700 outline-none"
                />
              </SectionCard>
            </ScrollView>

            <View className="border-t border-slate-200 bg-white px-4 py-3">
              <View className="flex-row items-center justify-between gap-3">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Previous day"
                  disabled={selectedIndex === 0}
                  onPress={() => selectDay(Math.max(selectedIndex - 1, 0))}
                  className={`h-14 min-w-[112px] flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 ${
                    selectedIndex === 0 ? 'bg-slate-50 opacity-60' : 'bg-white'
                  }`}>
                  <ArrowLeft size={18} color="#64748b" />
                  <Text className="text-sm font-semibold text-slate-500">Previous</Text>
                </Pressable>
                <Text className="text-base font-semibold text-slate-950">
                  Day {selectedIndex + 1} of {days.length}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Next day"
                  disabled={selectedIndex === days.length - 1}
                  onPress={() => selectDay(Math.min(selectedIndex + 1, days.length - 1))}
                  className={`h-14 min-w-[112px] flex-row items-center justify-center gap-2 rounded-2xl px-4 ${
                    selectedIndex === days.length - 1 ? 'bg-slate-200 opacity-60' : 'bg-[#1764ff]'
                  }`}>
                  <Text className="text-base font-semibold text-white">Next</Text>
                  <ArrowRight size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
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

function MobileWeekHeader({
  monday,
  weekRange,
  weekOffset,
  onChangeWeek,
}: {
  monday: Date;
  weekRange: string;
  weekOffset: number;
  onChangeWeek: (delta: number) => void;
}) {
  const weekNumber = getIsoWeekNumber(monday);

  return (
    <View className="border-b border-slate-200 bg-white px-4 pb-5 pt-5">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Week {weekNumber}
        {weekOffset === 0 ? ' - Current' : ''}
      </Text>
      <View className="mt-3 flex-row items-center gap-3">
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

function MobileWeekSummary({ onEdit }: { onEdit: () => void }) {
  return (
    <SectionCard className="p-4">
      <View className="flex-row items-center gap-3">
        <View className="min-w-0 flex-1 flex-row items-center">
          <SummaryMetric label="Week Total" value={timesheetTotals.mobileTotal} />
          <SummaryMetric label="Overtime Hours" value="2h 00m" bordered />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit timesheet week"
          onPress={onEdit}
          className="h-14 w-[92px] flex-row items-center justify-center gap-2 rounded-2xl bg-[#1764ff] px-3">
          <Pencil size={18} color="#fff" />
          <Text className="text-base font-semibold text-white">Edit</Text>
        </Pressable>
      </View>
    </SectionCard>
  );
}

function MobileDayDetailsTable({
  days,
  onEditDay,
}: {
  days: DayData[];
  onEditDay: (index: number) => void;
}) {
  return (
    <SectionCard className="overflow-hidden">
      <View className="flex-row items-center px-4 py-4">
        <Text className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Day</Text>
        <Text className="w-[86px] text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Total</Text>
        <Text className="w-[112px] text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status</Text>
        <View className="w-5" />
      </View>

      {days.map((day, index) => {
        const status = getDayStatus(day);
        const statusMeta = getStatusMeta(status);
        const isMuted = status === 'not-started';

        return (
          <Pressable
            key={day.key}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${day.short}, ${day.date}`}
            onPress={() => onEditDay(index)}
            className="flex-row items-center border-t border-slate-100 px-4 py-4">
            <Text
              numberOfLines={1}
              className={`min-w-0 flex-1 text-base font-semibold ${isMuted ? 'text-slate-400' : 'text-slate-950'}`}>
              {day.short}, <Text className={isMuted ? 'font-normal text-slate-400' : 'font-normal text-slate-950'}>{day.date}</Text>
            </Text>
            <Text
              numberOfLines={1}
              className={`w-[86px] text-base font-semibold ${isMuted ? 'text-slate-400' : 'text-slate-950'}`}>
              {day.total}
            </Text>
            <View className="w-[112px] flex-row items-center gap-2">
              <DayStatusDot color={statusMeta.dot} />
              <Text numberOfLines={1} className="text-sm" style={{ color: statusMeta.textColor }}>
                {statusMeta.label}
              </Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </Pressable>
        );
      })}
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
  const copyButtonLabel = compactFooterLabels ? 'Copy Prev.' : 'Copy Prev. Week';
  const submitButtonLabel = compactFooterLabels ? 'Submit' : 'Submit Week';
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  function changeWeek(delta: number) {
    setEditorVisible(false);
    setSelectedDayIndex(0);
    onChangeWeek(delta);
  }

  function openEditor(index = 0) {
    setSelectedDayIndex(index);
    setEditorVisible(true);
  }

  return (
    <View className="flex-1 lg:hidden">
      <View className="flex-1">
        <MobileWeekHeader monday={monday} weekRange={weekRange} weekOffset={weekOffset} onChangeWeek={changeWeek} />

        <View className="flex-1">
          <ScrollView
            className="flex-1"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
            <View className="gap-4">
              <MobileWeekSummary onEdit={() => openEditor(0)} />
              <MobileDayDetailsTable days={days} onEditDay={openEditor} />
            </View>
          </ScrollView>
        </View>

        <View className="border-t border-slate-200 bg-white px-4 py-3">
          <View className="flex-row items-center gap-2">
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

      <DayEditorModal
        days={days}
        selectedIndex={selectedDayIndex}
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        onSelectDay={setSelectedDayIndex}
        weekRange={weekRange}
      />
    </View>
  );
}

function DesktopTimesheets() {
  return (
    <View className="hidden flex-1 lg:flex">
      <View className="flex-1 px-6 pb-6 pt-6 xl:px-8 xl:pb-8">
        <View className="w-full self-center xl:w-[94%] 2xl:w-[90%]">
          <Text className="text-[20px] font-semibold tracking-tight text-slate-950 xl:text-[22px] 2xl:text-[24px]">Timesheets</Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500 xl:text-[15px] 2xl:text-base 2xl:leading-7">Submit and manage your weekly timesheets</Text>
        </View>

        <View className="mt-5 w-full flex-1 self-center xl:mt-6 xl:w-[94%] 2xl:w-[90%]">
          <SectionCard className="flex-1 overflow-hidden">
            <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4 xl:px-6 xl:py-5">
              <GhostButton label="Previous Week" icon={<ChevronLeft size={22} color="#0f172a" />} />
              <View className="items-center">
                <View className="flex-row items-center gap-4">
                  <CalendarDays size={24} color="#0f172a" />
                  <Text className="text-[22px] font-semibold text-slate-950 xl:text-[24px] 2xl:text-[26px]">{timesheetWeek.desktopRange}</Text>
                </View>
                <View className="mt-2 flex-row items-center gap-4">
                  <Text className="text-sm text-slate-500 xl:text-base 2xl:text-lg">{timesheetWeek.weekNumber}</Text>
                  <View className="rounded-full bg-amber-100 px-3 py-1.5 xl:px-4 xl:py-2">
                    <Text className="text-sm font-medium text-amber-700 xl:text-base">{timesheetWeek.status}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm font-medium text-slate-900 xl:text-base 2xl:text-lg">Next Week</Text>
                <View className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white xl:h-14 xl:w-14">
                  <ChevronRight size={22} color="#0f172a" />
                </View>
              </View>
            </View>

            <View className="flex-1 px-5 py-4 xl:px-6 xl:py-5">
              <View className="flex-row border-b border-slate-100 pb-4">
                <View className="w-28 pr-3 xl:w-32 2xl:w-36 2xl:pr-4">
                  <Text className="text-sm font-semibold text-slate-700 xl:text-base lg:tracking-[0.08em]">DAY</Text>
                </View>
                {[
                  ['Hours', '(Required)'],
                  ['OT Hours', '(Hours)'],
                  ['Vacation', '(Hours)'],
                  ['Sick', '(Hours)'],
                  ['Field', '(Hours)'],
                  ['Job #', '(Optional)'],
                ].map(([label, sub]) => (
                  <View key={label} className="w-28 pr-2 xl:w-32 xl:pr-3 2xl:w-40">
                    <Text className="text-sm font-semibold text-slate-700 xl:text-base">{label}</Text>
                    <Text className="mt-1 text-xs text-slate-400 xl:text-sm 2xl:text-base">{sub}</Text>
                  </View>
                ))}
                <View className="min-w-[260px] flex-1 xl:min-w-[320px] 2xl:min-w-[380px]">
                  <Text className="text-sm font-semibold text-slate-700 xl:text-base">Details</Text>
                  <Text className="mt-1 text-xs text-slate-400 xl:text-sm 2xl:text-base">(What did you work on?)</Text>
                </View>
              </View>

              <View className="flex-1 justify-between">
                {desktopTimesheetGrid.map((row, index) => (
                  <View
                    key={row.day}
                    className={`flex-row items-center py-2.5 xl:py-3 ${index < desktopTimesheetGrid.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <View className="w-28 pr-3 xl:w-32 2xl:w-36 2xl:pr-4">
                      <Text className="text-[17px] font-semibold text-slate-950 xl:text-[18px] 2xl:text-[20px]">{row.day}</Text>
                      <Text className="mt-1 text-sm text-slate-400 xl:text-[15px] 2xl:text-base">{row.date}</Text>
                    </View>
                    {[row.hours, row.overtime, row.vacation, row.sick, row.field, row.job].map((value, valueIndex) => (
                      <View key={`${row.day}-${valueIndex}`} className="w-28 pr-2 xl:w-32 xl:pr-3 2xl:w-40">
                        <TextInput
                          editable={false}
                          value={value}
                          className="rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 xl:px-3.5 xl:py-3 xl:text-[15px] 2xl:rounded-2xl 2xl:px-4 2xl:py-3.5 2xl:text-base"
                        />
                      </View>
                    ))}
                    <View className="min-w-[260px] flex-1 xl:min-w-[320px] 2xl:min-w-[380px]">
                      <TextInput
                        editable={false}
                        value={row.details}
                        className="rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 xl:px-3.5 xl:py-3 xl:text-[15px] 2xl:rounded-2xl 2xl:px-4 2xl:py-3.5 2xl:text-base"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </SectionCard>
        </View>

        <View className="mt-4 w-full self-center xl:w-[94%] 2xl:w-[90%]">
          <SectionCard className="px-5 py-4 xl:px-6 xl:py-5">
            <View className="flex-row items-center">
              <View className="pr-5 xl:pr-6">
                <Text className="text-[16px] font-semibold leading-7 text-slate-950 xl:text-[18px] xl:leading-8">Weekly{"\n"}Totals</Text>
              </View>
              {[
                [timesheetTotals.hours, 'Hours'],
                [timesheetTotals.overtime, 'OT Hours'],
                [timesheetTotals.vacation, 'Vacation'],
                [timesheetTotals.sick, 'Sick'],
                [timesheetTotals.field, 'Field'],
              ].map(([value, label]) => (
                <View key={label} className="border-l border-slate-100 px-4 xl:px-5 2xl:px-6">
                  <Text className="text-[16px] font-semibold text-slate-950 xl:text-[18px] 2xl:text-[20px]">{value}</Text>
                  <Text className="mt-1.5 text-xs text-slate-400 xl:text-sm 2xl:text-base">{label}</Text>
                </View>
              ))}
              <View className="ml-auto flex-row items-center gap-2.5 xl:gap-3">
                <Text className="text-xs text-slate-400 xl:text-sm 2xl:text-base">Auto-saved just now</Text>
                <GhostButton label="Copy Last Week" icon={<Copy size={20} color="#334155" />} />
                <GhostButton label="Clear Week" icon={<Trash2 size={20} color="#334155" />} />
                <PrimaryButton label="Submit Timesheet" icon={<ChevronRight size={20} color="#fff" />} />
              </View>
            </View>
          </SectionCard>
        </View>
      </View>
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
      <DesktopTimesheets />
    </View>
  );
}
