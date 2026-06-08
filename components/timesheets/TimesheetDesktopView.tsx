import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { t } from '@/constants/tokens';
import type { TimesheetEntryRow, TimesheetValidationErrors } from '@/types';

type TimesheetDesktopViewProps = {
  entries: TimesheetEntryRow[];
  validationErrors: TimesheetValidationErrors;
  isReadOnly: boolean;
  onUpdateEntry: (date: string, field: keyof TimesheetEntryRow, value: string | number) => void;
};

// flex proportions — Details gets more room, numeric cols are equal
const COLUMNS = [
  { key: 'hours',       label: 'Hours',    sub: '(Required)',              flex: 1 },
  { key: 'otHours',     label: 'OT Hours', sub: '',                        flex: 1 },
  { key: 'vacation',    label: 'Vacation', sub: '(Hours)',                 flex: 1 },
  { key: 'sick',        label: 'Sick',     sub: '(Hours)',                 flex: 1 },
  { key: 'fieldHours',  label: 'Field',    sub: '(Hours)',                 flex: 1 },
  { key: 'jobNumber',   label: 'Job #',    sub: '(Optional)',              flex: 1.1 },
  { key: 'details',     label: 'Details',  sub: '(What did you work on?)', flex: 2.8 },
] as const;

const NUMERIC_FIELDS = new Set(['hours', 'otHours', 'vacation', 'sick', 'fieldHours']);
const DAY_FLEX = 1.1;

type CellProps = {
  value: string | number;
  field: keyof TimesheetEntryRow;
  date: string;
  flex: number;
  isReadOnly: boolean;
  error?: string;
  draftValue?: string;
  onDraftChange: (date: string, field: keyof TimesheetEntryRow, value?: string) => void;
  onUpdate: (date: string, field: keyof TimesheetEntryRow, value: string | number) => void;
};

function Cell({ value, field, date, flex, isReadOnly, error, draftValue, onDraftChange, onUpdate }: CellProps) {
  const isNum = NUMERIC_FIELDS.has(field);
  // Show placeholder for default zero values; keep typed decimals exactly as entered.
  const displayValue = isNum
    ? (draftValue ?? ((value as number) === 0 ? '' : String(value)))
    : String(value);

  return (
    <View style={{ flex, paddingHorizontal: 5 }}>
      <TextInput
        value={displayValue}
        onChangeText={(text) => {
          if (isReadOnly) return;
          if (isNum) {
            // Allow users to type transitional decimal values like "8.".
            if (!/^\d*(\.\d*)?$/.test(text)) return;
            onDraftChange(date, field, text);

            if (text === '') {
              onUpdate(date, field, 0);
              return;
            }

            // Do not commit while trailing decimal is in progress.
            if (text.endsWith('.')) return;

            const parsed = Number(text);
            onUpdate(date, field, Number.isNaN(parsed) ? 0 : parsed);
          } else {
            onUpdate(date, field, text);
          }
        }}
        onEndEditing={() => {
          if (!isNum || isReadOnly) return;
          const text = draftValue ?? '';
          if (text === '') {
            onUpdate(date, field, 0);
            onDraftChange(date, field, undefined);
            return;
          }

          const normalized = text.endsWith('.') ? text.slice(0, -1) : text;
          const parsed = Number(normalized);
          onUpdate(date, field, Number.isNaN(parsed) ? 0 : parsed);
          onDraftChange(date, field, undefined);
        }}
        editable={!isReadOnly}
        keyboardType={isNum ? 'decimal-pad' : 'default'}
        placeholder={isNum ? '0' : ''}
        placeholderTextColor="#94a3b8"
        style={{
          height: 42,
          borderWidth: 1,
          borderColor: error ? '#ef4444' : '#cbd5e1',
          borderRadius: 6,
          paddingHorizontal: 12,
          fontSize: 14,
          lineHeight: 20,
          color: isReadOnly ? '#94a3b8' : '#111827',
          backgroundColor: isReadOnly ? '#f9fafb' : '#ffffff',
        }}
      />
      {error ? (
        <Text style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>{error}</Text>
      ) : null}
    </View>
  );
}

export function TimesheetDesktopView({
  entries,
  validationErrors,
  isReadOnly,
  onUpdateEntry,
}: TimesheetDesktopViewProps) {
  const [numericDrafts, setNumericDrafts] = useState<Record<string, string>>({});

  const handleDraftChange = (date: string, field: keyof TimesheetEntryRow, value?: string) => {
    const key = `${date}:${String(field)}`;
    setNumericDrafts((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  return (
    <Box className={`flex-1 ${t.bg.surface}`} style={{ backgroundColor: '#ffffff' }}>
      {/* ── Column header ──────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: '#f8fafc',
          borderBottomColor: '#e2e8f0',
          borderBottomWidth: 1,
          flexDirection: 'row',
          paddingHorizontal: 22,
          paddingVertical: 14,
        }}
      >
        <View style={{ flex: DAY_FLEX, paddingHorizontal: 5 }}>
          <Text className={`text-xs font-semibold uppercase tracking-wide ${t.text.muted}`}>Day</Text>
        </View>
        {COLUMNS.map((col) => (
          <View key={col.key} style={{ flex: col.flex, paddingHorizontal: 5 }}>
            <Text className={`text-xs font-semibold ${t.text.secondary}`}>{col.label}</Text>
            {col.sub ? <Text className={`text-xs ${t.text.faint}`}>{col.sub}</Text> : null}
          </View>
        ))}
      </View>

      {/* ── Data rows ──────────────────────────────────────────────── */}
      {entries.map((row, index) => {
        const isWeekend = row.day === 'Sat' || row.day === 'Sun';
        const isLastRow = index === entries.length - 1;
        const rowErrors = validationErrors[row.date] ?? {};
        const dateObj = new Date(row.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <View
            key={row.date}
            style={{
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderBottomColor: isLastRow ? '#e2e8f0' : '#eef2f7',
              borderBottomWidth: 1,
              flexDirection: 'row',
              minHeight: 72,
              paddingHorizontal: 22,
              paddingVertical: 10,
            }}
          >
            {/* Day label — two lines: "Mon" + "May 19" */}
            <View style={{ flex: DAY_FLEX, paddingHorizontal: 5, justifyContent: 'center' }}>
              <Text className={`text-sm font-semibold ${isWeekend ? t.text.muted : t.text.primary}`}>
                {row.day}
              </Text>
              <Text className={`text-xs ${t.text.faint}`}>{dateStr}</Text>
            </View>

            {COLUMNS.map((col) => (
              <Cell
                key={col.key}
                value={row[col.key]}
                field={col.key}
                date={row.date}
                flex={col.flex}
                isReadOnly={isReadOnly}
                error={rowErrors[col.key]}
                draftValue={numericDrafts[`${row.date}:${String(col.key)}`]}
                onDraftChange={handleDraftChange}
                onUpdate={onUpdateEntry}
              />
            ))}
          </View>
        );
      })}

      {/* ── Weekly totals row removed — rendered as separate footer card in screen ── */}
    </Box>
  );
}


