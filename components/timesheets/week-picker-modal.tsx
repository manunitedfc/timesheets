import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

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
