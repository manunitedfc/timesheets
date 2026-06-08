import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Copy, Ellipsis, Plane, Trash2, Upload } from 'lucide-react-native';
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
}: {
  openDay: string;
  setOpenDay: (value: string) => void;
}) {
  return (
    <View className="flex-1 lg:hidden">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-64 pt-6"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-[42px] font-semibold tracking-tight text-slate-950">Timesheets</Text>
            <Text className="mt-2 text-[18px] leading-8 text-slate-500">Submit and manage your weekly timesheets</Text>
          </View>
          <View className="h-16 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200">
            <Ellipsis size={26} color="#0f172a" />
          </View>
        </View>

        <SectionCard className="mt-8 p-5">
          <View className="flex-row items-center justify-between gap-3">
            <View className="h-20 w-20 items-center justify-center rounded-[22px] border border-slate-200 bg-white">
              <ChevronLeft size={28} color="#0f172a" />
            </View>
            <View className="flex-1 items-center">
              <CalendarDays size={40} color="#1764ff" />
              <Text className="mt-3 text-xl text-slate-500">{timesheetWeek.label}</Text>
              <Text className="mt-1 text-[30px] font-semibold text-slate-950">{timesheetWeek.range}</Text>
              <View className="mt-4 flex-row items-center gap-3">
                <View className="rounded-full bg-amber-100 px-4 py-2">
                  <Text className="text-base font-medium text-amber-700">{timesheetWeek.status}</Text>
                </View>
                <Text className="text-lg text-slate-400">|</Text>
                <Text className="text-lg text-slate-500">{timesheetWeek.lastSaved}</Text>
                <Text className="text-lg text-slate-400">|</Text>
                <View className="flex-row items-center gap-2">
                  <Upload size={18} color="#22c55e" />
                  <Text className="text-lg text-slate-500">{timesheetWeek.autosave}</Text>
                </View>
              </View>
            </View>
            <View className="h-20 w-20 items-center justify-center rounded-[22px] border border-slate-200 bg-white">
              <ChevronRight size={28} color="#0f172a" />
            </View>
          </View>
        </SectionCard>

        <View className="mt-6 gap-4">
          {mobileTimesheetDays.map((day) => {
            const expanded = openDay === day.key;
            return (
              <SectionCard key={day.key} className="overflow-hidden">
                <Pressable
                  onPress={() => setOpenDay(expanded ? '' : day.key)}
                  className="flex-row items-center justify-between px-6 py-6">
                  <Text className={`text-[24px] ${day.hours === '0.00' ? 'text-slate-400' : 'text-slate-950'} font-semibold`}>
                    {day.short}, <Text className={`${day.hours === '0.00' ? 'text-slate-400' : 'text-slate-500'} font-normal`}>{day.date}</Text>
                  </Text>
                  <View className="flex-row items-center gap-5">
                    <Text className={`text-[24px] font-semibold ${day.hours === '0.00' ? 'text-slate-400' : 'text-slate-950'}`}>{day.total}</Text>
                    <ChevronDown size={24} color="#64748b" />
                  </View>
                </Pressable>
                {expanded ? (
                  <View className="border-t border-slate-100 px-6 pb-6 pt-5">
                    <Text className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Project</Text>
                    <Text className="mt-2 text-base font-medium text-slate-900">{day.project}</Text>
                    <View className="mt-5 flex-row gap-4">
                      <View className="flex-1">
                        <Text className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Hours</Text>
                        <View className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <Text className="text-lg font-medium text-slate-900">{day.hours}</Text>
                        </View>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">OT Hours</Text>
                        <View className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <Text className="text-lg font-medium text-slate-900">{day.overtime}</Text>
                        </View>
                      </View>
                    </View>
                    <Text className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Notes</Text>
                    <View className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <Text className="text-base leading-7 text-slate-600">{day.notes}</Text>
                    </View>
                  </View>
                ) : null}
              </SectionCard>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <SectionCard className="rounded-b-none rounded-t-[32px] border-b-0 px-6 py-5">
          <View className="flex-row items-center gap-5">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Clock3 size={34} color="#163b7a" />
            </View>
            <View className="flex-1">
              <Text className="text-lg text-slate-500">Total Hours</Text>
              <Text className="mt-1 text-[30px] font-semibold text-slate-950">{timesheetTotals.mobileTotal}</Text>
            </View>
          </View>
          <View className="my-5 h-px bg-slate-100" />
          <View className="flex-row gap-4">
            <GhostButton label="Copy Prev. Week" icon={<Copy size={24} color="#1764ff" />} wide />
            <PrimaryButton label="Submit" icon={<Plane size={24} color="#fff" />} wide />
          </View>
        </SectionCard>
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
  const [openDay, setOpenDay] = useState('mon');

  return (
    <View className="flex-1 bg-slate-100">
      <MobileTimesheets openDay={openDay} setOpenDay={setOpenDay} />
      <DesktopTimesheets />
    </View>
  );
}
