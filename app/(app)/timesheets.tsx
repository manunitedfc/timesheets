import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Copy, Plane, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { desktopTimesheetGrid, mobileTimesheetDays, timesheetTotals, timesheetWeek } from '@/components/app/mock-data';

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`rounded-[24px] border border-slate-200 bg-white shadow-sm shadow-slate-200 xl:rounded-[28px] ${className}`}>{children}</View>;
}

function GhostButton({ label, icon, wide = false }: { label: string; icon?: React.ReactNode; wide?: boolean }) {
  return (
    <View className={`flex-row items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 xl:px-5 xl:py-3.5 ${wide ? 'flex-1' : ''}`}>
      {icon}
      <Text className="text-sm font-medium text-slate-800 xl:text-base">{label}</Text>
    </View>
  );
}

// ── Week navigation helpers ──────────────────────────────────────────────────

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
  return `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`;
}

function buildWeekDays(monday: Date, weekOffset: number) {
  const SHORTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const KEYS   = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return SHORTS.map((short, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const mock = weekOffset === 0 ? mobileTimesheetDays[i] : null;
    return {
      key:         KEYS[i],
      short,
      date,
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

function MobileTimesheets({
  openDay,
  setOpenDay,
  weekOffset,
  onChangeWeek,
}: {
  openDay: string;
  setOpenDay: (value: string) => void;
  weekOffset: number;
  onChangeWeek: (delta: number) => void;
}) {
  const monday = getWeekMonday(weekOffset);
  const weekRange = formatWeekRange(monday);
  const days = buildWeekDays(monday, weekOffset);

  return (
    <View className="flex-1 lg:hidden">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        showsVerticalScrollIndicator={false}>

        <SectionCard className="p-4">
          <View className="flex-row items-center justify-between gap-2">
            <Pressable
              onPress={() => onChangeWeek(-1)}
              className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <ChevronLeft size={20} color="#0f172a" />
            </Pressable>
            <View className="flex-1 items-center justify-center">
              <Text className="text-center text-base font-semibold text-slate-950">
                {weekRange}
              </Text>
              {weekOffset === 0 && (
                <Text className="absolute -top-4 w-full text-center text-xs text-slate-500">
                  Current Week
                </Text>
              )}
            </View>
            <Pressable
              onPress={() => onChangeWeek(1)}
              className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <ChevronRight size={20} color="#0f172a" />
            </Pressable>
          </View>
        </SectionCard>

        <View className="mt-4 gap-3">
          {days.map((day) => {
            const expanded = openDay === day.key;
            const isEmpty = day.hours === '0.00';
            const isWeekend = day.key === 'sat' || day.key === 'sun';
            return (
              <SectionCard key={day.key} className="overflow-hidden">
                <Pressable
                  onPress={() => setOpenDay(expanded ? '' : day.key)}
                  className="flex-row items-center justify-between px-4 py-4">
                  <Text className={`text-base font-semibold ${isWeekend ? 'text-slate-400' : 'text-slate-950'}`}>
                    {day.short},{' '}
                    <Text className={`font-normal ${isWeekend ? 'text-slate-400' : 'text-slate-500'}`}>{day.date}</Text>
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <Text className={`text-base font-semibold ${isWeekend ? 'text-slate-400' : 'text-slate-950'}`}>{day.total}</Text>
                    <ChevronDown size={18} color="#64748b" />
                  </View>
                </Pressable>
                {expanded && (
                  <View className="border-t border-slate-100 px-4 pb-5 pt-4">
                    <View className="flex-row flex-wrap gap-3">
                      {(
                        [
                          { label: 'Hours',    value: day.hours },
                          { label: 'OT Hours', value: day.overtime },
                          { label: 'Vacation', value: day.vacation },
                          { label: 'Sick',     value: day.sick },
                          { label: 'Field',    value: day.field },
                          { label: 'Job #',    value: day.job },
                        ] as { label: string; value: string }[]
                      ).map(({ label, value }) => (
                        <View key={label} className="min-w-[28%] flex-1">
                          <Text className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</Text>
                          <View className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <Text className="text-sm font-medium text-slate-900">{value || '—'}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <Text className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Description</Text>
                    <View className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <Text className="text-sm leading-5 text-slate-600">{day.description || '—'}</Text>
                    </View>
                  </View>
                )}
              </SectionCard>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Clock3 size={20} color="#163b7a" />
          </View>
          <View className="mr-1">
            <Text className="text-xs text-slate-500">Total Hours</Text>
            <Text className="text-base font-semibold text-slate-950">{timesheetTotals.mobileTotal}</Text>
          </View>
          <GhostButton label="Copy Prev." icon={<Copy size={15} color="#1764ff" />} wide />
          <PrimaryButton label="Submit" icon={<Plane size={15} color="#fff" />} wide />
        </View>
      </View>
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
  const [openDay, setOpenDay] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  function changeWeek(delta: number) {
    setWeekOffset((w) => w + delta);
    setOpenDay('');
  }

  return (
    <View className="flex-1 bg-slate-100">
      <MobileTimesheets openDay={openDay} setOpenDay={setOpenDay} weekOffset={weekOffset} onChangeWeek={changeWeek} />
      <DesktopTimesheets />
    </View>
  );
}
