import { ChevronRight, Copy, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Text as RNText, View } from 'react-native';

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
  const [clearPending, setClearPending] = useState(false);

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

  const mobileViewProps = {
    entries: ts.entries,
    totals: ts.totals,
    validationErrors: ts.validationErrors,
    isReadOnly: ts.isReadOnly,
    status: ts.status,
    lastSavedAt: ts.lastSavedAt,
    onUpdateEntry: ts.updateEntry,
    onCopyLastWeek: ts.copyLastWeek,
    onClearWeek: ts.clearWeek,
    onSubmit: () => ts.submitTimesheet((p) => console.log('submitted', p)),
  };
  const savedLabel = formatFooterSavedLabel(ts.lastSavedAt);

  return (
    <ScreenContainer>
      <PageHeader
        title="Timesheets"
        subtitle="Submit and manage your weekly timesheets"
      />

      {/* ── Desktop layout (lg+) ─────────────────────────────────────────── */}
      <Box className="hidden flex-1 flex-col lg:flex">
        {/* 1. Week traversal — above the card */}
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
      </Box>

      {/* ── Mobile layout (< lg + native) ─────────────── */}
      <Box className="flex lg:hidden flex-1 flex-col -mx-4 -mb-4">
        <WeekNav {...weekNavProps} compact />
        <TimesheetMobileView {...mobileViewProps} />
      </Box>
    </ScreenContainer>
  );
}
