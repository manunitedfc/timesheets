import type { ReactNode } from 'react';
import { View } from 'react-native';

export function SectionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`rounded-[24px] border border-slate-200 bg-white shadow-sm shadow-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none xl:rounded-[28px] ${className}`}>{children}</View>;
}
