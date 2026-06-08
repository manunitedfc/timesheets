import { ChevronRight, Copy, Send, Trash2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text as RNText, View } from 'react-native';

import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { TimesheetDesktopView } from '@/components/timesheets/TimesheetDesktopView';
import { TimesheetMobileView } from '@/components/timesheets/TimesheetMobileView';
import { WeekNav } from '@/components/timesheets/WeekNav';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { t } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTimesheet } from '@/hooks/use-timesheet';

function formatFooterSavedLabel(date: Date | null): string {
  if (!date) return 'Not saved yet';

  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diff < 10) return 'Auto-saved just now';
  if (diff < 60) return `Auto-saved ${diff}s ago`;
  if (diff < 3600) return `Auto-saved ${Math.floor(diff / 60)}m ago`;

  return `Auto-saved at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export default function TimesheetsScreen() {
  const ts = useTimesheet();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [clearPending, setClearPending] = useState(false);

  const totalHoursRaw = ts.totals.hours + ts.totals.otHours;
  const th = Math.floor(totalHoursRaw);
  const tm = Math.round((totalHoursRaw - th) * 60);
  const totalHoursLabel = `${th}h ${String(tm).padStart(2, '0')}m`;

  const handleClearWeek = () => {
    if (clearPending) {
      setClearPending(false);
      ts.clearWeek();
    } else {
      setClearPending(true);
      setTimeout(() => setClearPending(false), 3000);
    }
  };

  const TOTAL_COLS = [
    { key: 'hours',      label: 'Hours' },
    { key: 'otHours',    label: 'OT Hours' },
    { key: 'vacation',   label: 'Vacation' },
    { key: 'sick',       label: 'Sick' },
    { key: 'fieldHours', label: 'Field' },
  ] as const;

  const weekNavProps = {
    weekLabel: ts.weekLabel,
    weekNum: ts.weekNum,
    status: ts.status,
    lastSavedAt: ts.lastSavedAt,
    isReadOnly: ts.isReadOnly,
    onPrev: ts.goPrevWeek,
    onNext: ts.goNextWeek,
    onCopyLastWeek: ts.copyLastWeek,
    onClearWeek: ts.clearWeek,
    onSubmit: () => ts.submitTimesheet((p) => console.log('submitted', p)),
  };

  const desktopViewProps = {
    entries: ts.entries,
    validationErrors: ts.validationErrors,
    isReadOnly: ts.isReadOnly,
    onUpdateEntry: ts.updateEntry,
  };

  const mobileScrollRef = useRef<ScrollView>(null);
  const mobileScrollOffsetY = useRef(0);

  const mobileViewProps = {
    entries: ts.entries,
    validationErrors: ts.validationErrors,
    isReadOnly: ts.isReadOnly,
    scrollViewRef: mobileScrollRef,
    scrollOffsetRef: mobileScrollOffsetY,
    onUpdateEntry: ts.updateEntry,
  };
  const savedLabel = formatFooterSavedLabel(ts.lastSavedAt);

  return (
    <View style={{ flex: 1 }}>
      {/* ── Desktop layout (lg+) ─────────────────────────────────────────── */}
      <Box className="hidden flex-1 flex-col lg:flex">
        <ScreenContainer>
          <PageHeader
            title="Timesheets"
            subtitle="Submit and manage your weekly timesheets"
          />
          <Box className={`overflow-hidden rounded-lg border ${t.border.default} ${t.bg.surface} shadow-sm`}>
            <WeekNav {...weekNavProps} compact={false} />
            <TimesheetDesktopView {...desktopViewProps} />
          </Box>

        {/* 3. Bottom footer card — totals left, submit right */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderColor: '#dbe3ec',
            borderRadius: 8,
            borderWidth: 1,
            flexDirection: 'row',
            height: 92,
            justifyContent: 'space-between',
            marginTop: 16,
            overflow: 'hidden',
            paddingHorizontal: 28,
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row', flexShrink: 0 }}>
            <View style={{ justifyContent: 'center', paddingRight: 22, width: 102 }}>
              <RNText style={{ color: '#0f172a', fontSize: 20, fontWeight: '700', lineHeight: 25 }}>
                Weekly{'\n'}Totals
              </RNText>
            </View>

            {TOTAL_COLS.map((col) => (
              <View key={col.key} style={{ alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ backgroundColor: '#e2e8f0', height: 58, width: 1 }} />
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, width: 92 }}>
                  <RNText style={{ color: '#0f172a', fontSize: 18, fontWeight: '700', lineHeight: 23 }}>
                    {(ts.totals as Record<string, number>)[col.key].toFixed(2)}
                  </RNText>
                  <RNText style={{ color: '#64748b', fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                    {col.label}
                  </RNText>
                </View>
              </View>
            ))}
            <View style={{ backgroundColor: '#e2e8f0', height: 58, width: 1 }} />
          </View>

          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginLeft: 24 }}>
            <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '500', lineHeight: 18, minWidth: 150, textAlign: 'right' }}>
              {savedLabel}
            </Text>
            {!ts.isReadOnly && (
              <>
                <Pressable
                  onPress={ts.copyLastWeek}
                  className="active:opacity-60"
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderColor: '#dbe3ec',
                    borderRadius: 8,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: 8,
                    height: 44,
                    justifyContent: 'center',
                    minWidth: 158,
                    paddingHorizontal: 18,
                  }}
                >
                  <Copy size={17} color="#334155" />
                  <Text style={{ color: '#0f172a', fontSize: 14, fontWeight: '600', lineHeight: 20 }}>
                    Copy Last Week
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleClearWeek}
                  className="active:opacity-60"
                  style={{
                    alignItems: 'center',
                    backgroundColor: clearPending ? '#fef2f2' : '#ffffff',
                    borderColor: clearPending ? '#f87171' : '#dbe3ec',
                    borderRadius: 8,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: 8,
                    height: 44,
                    justifyContent: 'center',
                    minWidth: 136,
                    paddingHorizontal: 18,
                  }}
                >
                  <Trash2 size={17} color={clearPending ? '#dc2626' : '#334155'} />
                  <Text style={{ color: clearPending ? '#dc2626' : '#0f172a', fontSize: 14, fontWeight: '600', lineHeight: 20 }}>
                    {clearPending ? 'Confirm Clear' : 'Clear Week'}
                  </Text>
                </Pressable>
                <Button
                  size="lg"
                  onPress={() => ts.submitTimesheet((p) => console.log('submitted', p))}
                  className="rounded-lg bg-blue-600 px-5 data-[hover=true]:bg-blue-700"
                  style={{ height: 44, minWidth: 198 }}
                >
                  <ButtonIcon as={ChevronRight} className="text-white" />
                  <ButtonText className="text-sm font-semibold text-white">Submit Timesheet</ButtonText>
                </Button>
              </>
            )}
          </View>
        </View>
        </ScreenContainer>
      </Box>

      {/* ── Mobile layout (< lg + native) ─────────────── */}
      <Box className="flex lg:hidden flex-1 flex-col">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            ref={mobileScrollRef}
            className={t.bg.page}
            contentContainerStyle={{ paddingBottom: 24, paddingTop: Platform.OS === 'web' ? 20 : 58 }}
            onScroll={(e) => { mobileScrollOffsetY.current = e.nativeEvent.contentOffset.y; }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <PageHeader title="Timesheets" subtitle="Submit and manage your weekly timesheets" />
            </View>
            <WeekNav {...weekNavProps} compact />
            <TimesheetMobileView {...mobileViewProps} />
          </ScrollView>

        {/* ── Mobile fixed footer bar ─────────────────────── */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderTopColor: isDark ? '#334155' : '#dbe3ec',
            borderTopWidth: 1,
            flexDirection: 'row',
            height: 76,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Hours</Text>
            <Text numberOfLines={1} className={`text-xl font-bold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
              {totalHoursLabel}
            </Text>
          </View>

          {!ts.isReadOnly ? (
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={ts.copyLastWeek}
                className="active:opacity-60"
                style={{
                  alignItems: 'center',
                  borderColor: isDark ? '#334155' : '#dbe3ec',
                  borderRadius: 12,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 11,
                }}
              >
                <Copy size={15} color={isDark ? '#94a3b8' : '#475569'} />
                <Text className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Copy Prev. Week</Text>
              </Pressable>
              <Pressable
                onPress={() => ts.submitTimesheet((p) => console.log('submitted', p))}
                className="active:opacity-80"
                style={{
                  alignItems: 'center',
                  backgroundColor: '#2563eb',
                  borderRadius: 12,
                  flexDirection: 'row',
                  gap: 6,
                  paddingHorizontal: 18,
                  paddingVertical: 11,
                }}
              >
                <Send size={15} color="#ffffff" />
                <Text className="text-sm font-bold text-white">Submit</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
        </KeyboardAvoidingView>
      </Box>
    </View>
  );
}
