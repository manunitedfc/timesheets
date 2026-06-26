import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

type Tone = 'positive' | 'warning' | 'neutral';

function toneClasses(tone: Tone) {
  switch (tone) {
    case 'positive':
      return 'bg-emerald-100 text-emerald-800';
    case 'warning':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

export function PageContainer({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="px-4 pb-20 pt-4 lg:px-8 lg:pb-8 lg:pt-6">
      <View className="mb-6 flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{title}</Text>
          <Text className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</Text>
        </View>
        {actions ? <View className="hidden lg:flex">{actions}</View> : null}
      </View>
      <View className="gap-4">{children}</View>
    </ScrollView>
  );
}

export function Card({
  title,
  eyebrow,
  children,
  footer,
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      {eyebrow ? <Text className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{eyebrow}</Text> : null}
      {title ? <Text className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">{title}</Text> : null}
      <View className={title || eyebrow ? 'mt-4' : ''}>{children}</View>
      {footer ? <View className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">{footer}</View> : null}
    </View>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
}) {
  return (
    <Card>
      <Text className="text-sm text-slate-500 dark:text-slate-400">{label}</Text>
      <Text className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">{value}</Text>
      <View className="mt-4 self-start rounded-full px-3 py-1">
        <Text className={`rounded-full px-3 py-1 text-xs font-medium ${toneClasses(tone)}`}>{delta}</Text>
      </View>
    </Card>
  );
}

export function StatusPill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${toneClasses(tone).split(' ')[0]}`}>
      <Text className={`text-xs font-medium ${toneClasses(tone).split(' ')[1]}`}>{label}</Text>
    </View>
  );
}

export function DataList({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <View className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <View className="bg-slate-50 px-4 py-3 dark:bg-slate-950">
        <View className="flex-row gap-3">
          {columns.map((column) => (
            <Text key={column} className="flex-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              {column}
            </Text>
          ))}
        </View>
      </View>
      {rows.map((row, rowIndex) => (
        <View
          key={`${row[0]}-${rowIndex}`}
          className={`flex-row gap-3 px-4 py-4 ${rowIndex < rows.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
          {row.map((cell, cellIndex) => (
            <Text key={`${cell}-${cellIndex}`} className={`flex-1 text-sm ${cellIndex === 0 ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
