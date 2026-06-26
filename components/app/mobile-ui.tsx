import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

export function MobilePage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950 lg:hidden"
      contentContainerClassName="gap-3 px-4 pb-20 pt-4"
      showsVerticalScrollIndicator={false}>
      <View className="px-1 pb-1">
        <Text className="text-[24px] font-semibold tracking-tight text-slate-950 dark:text-slate-50">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{description}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

export function MobileCard({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className={`rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${className}`}>
      {title || action ? (
        <View className="mb-3 flex-row items-center justify-between gap-3">
          {title ? <Text className="min-w-0 flex-1 text-base font-semibold text-slate-950 dark:text-slate-50">{title}</Text> : <View />}
          {action}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function MobileListRow({
  icon,
  title,
  subtitle,
  meta,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-3 border-b border-slate-100 py-3 last:border-b-0 dark:border-slate-800">
      {icon ? <View className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950">{icon}</View> : null}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-sm font-semibold text-slate-950 dark:text-slate-50">
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {meta}
    </View>
  );
}

export function MobilePill({ label, tone = 'neutral' }: { label: string; tone?: 'positive' | 'warning' | 'neutral' | 'danger' }) {
  const classes = {
    positive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  }[tone];

  const [bgClass, textClass, darkBgClass, darkTextClass] = classes.split(' ');

  return (
    <View className={`rounded-full px-2.5 py-1 ${bgClass} ${darkBgClass ?? ''}`}>
      <Text className={`text-[11px] font-semibold ${textClass} ${darkTextClass ?? ''}`}>{label}</Text>
    </View>
  );
}
