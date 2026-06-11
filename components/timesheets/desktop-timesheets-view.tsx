import { CalendarDays, Check, ChevronLeft, ChevronRight, Copy, Plane, Trash2 } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { SectionCard } from '@/components/timesheets/section-card';
import { getStatusMeta } from '@/lib/timesheets/status-utils';
import type { DayStatus, TimesheetDay, TimesheetDayField, TimesheetWeek } from '@/types/timesheets';

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

function DesktopField({
  label,
  sublabel,
  value,
  onChangeText,
  numeric = true,
  wide = false,
}: {
  label: string;
  sublabel?: string;
  value: string;
  onChangeText?: (value: string) => void;
  numeric?: boolean;
  wide?: boolean;
}) {
  return (
    <View className={wide ? 'w-full' : 'min-w-[180px] flex-1'}>
      <Text className="text-sm font-semibold text-slate-700 xl:text-base">{label}</Text>
      {sublabel ? <Text className="mt-1 text-xs text-slate-400 xl:text-sm">{sublabel}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        inputMode={numeric ? 'decimal' : 'text'}
        keyboardType={numeric ? 'decimal-pad' : 'default'}
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

export function DesktopTimesheetsView({
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
                  <DesktopField
                    label={field.label}
                    sublabel={field.sublabel}
                    value={activeRow.desktop[field.key]}
                    onChangeText={(value) => onUpdateDayField(activeRow.key, field.key, value)}
                  />
                </View>
              ))}
              <View className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                <DesktopCheckboxField label="Field" checked={hasFieldWork(activeRow)} onPress={() => onToggleFieldWork(activeRow.key)} />
              </View>
              {bottomRowFieldMeta.map((field) => (
                <View key={field.key} className="mb-7 w-1/2 min-w-[280px] px-3 2xl:w-1/3">
                  <DesktopField
                    label={field.label}
                    sublabel={field.sublabel}
                    value={activeRow.desktop[field.key]}
                    numeric={field.key !== 'job'}
                    onChangeText={(value) => onUpdateDayField(activeRow.key, field.key, value)}
                  />
                </View>
              ))}
              <View className="w-full px-3">
                <DesktopField
                  label="What did you work on?"
                  value={activeRow.desktop.description}
                  numeric={false}
                  wide
                  onChangeText={(value) => onUpdateDayField(activeRow.key, 'description', value)}
                />
              </View>
            </View>
          </SectionCard>

          <SectionCard className="mt-4 px-6 py-5 xl:px-8 xl:py-6">
            <View className="flex-row flex-wrap items-center gap-y-5">
              <View className="pr-6">
                <Text className="text-[16px] font-semibold leading-8 text-slate-950 xl:text-[18px]">
                  Weekly{"\n"}totals
                </Text>
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
