import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { Modal, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';

import { getMonthLabel, getMonthName, getWeeksForMonth } from '@/lib/timesheets/date-utils';

type WeekPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  weekOffset: number;
  pickerMonth: Date;
  onChangeMonth: (delta: number) => void;
  onSetPickerMonth: (date: Date) => void;
  onSelectWeek: (offset: number) => void;
};

export function WeekPickerModal({
  visible,
  onClose,
  weekOffset,
  pickerMonth,
  onChangeMonth,
  onSetPickerMonth,
  onSelectWeek,
}: WeekPickerModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor = colorScheme === 'dark' ? '#e2e8f0' : '#0f172a';
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
        <View className="w-full max-w-[440px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
          <View className="flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text className="text-lg font-semibold text-slate-950 dark:text-slate-50">Choose Week</Text>
              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select a weekly date range</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close week picker"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
              <X size={18} color={iconColor} />
            </Pressable>
          </View>
          <View className="mt-5 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={() => onChangeMonth(-1)}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900">
              <ChevronLeft size={18} color={iconColor} />
            </Pressable>
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{getMonthLabel(pickerMonth)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={() => onChangeMonth(1)}
              className="h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900">
              <ChevronRight size={18} color={iconColor} />
            </Pressable>
          </View>
          <View className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
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
                    className={`flex-1 rounded-xl border px-2 py-2.5 ${active ? 'border-[#1764ff] bg-blue-50 dark:bg-blue-950/40' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                    <Text className={`text-center text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-700 dark:text-slate-200'}`}>{year}</Text>
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
                    className={`min-w-[62px] rounded-xl border px-3 py-2 ${active ? 'border-[#1764ff] bg-blue-50 dark:bg-blue-950/40' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                    <Text className={`text-center text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-700 dark:text-slate-200'}`}>{month.label}</Text>
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
                    className={`rounded-2xl border px-4 py-3 ${active ? 'border-[#1764ff] bg-blue-50 dark:bg-blue-950/40' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                    <Text className={`text-sm font-semibold ${active ? 'text-[#1764ff]' : 'text-slate-900 dark:text-slate-100'}`}>{option.label}</Text>
                    <Text className={`mt-1 text-sm ${active ? 'text-[#1764ff]' : 'text-slate-500 dark:text-slate-400'}`}>{option.range}</Text>
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
