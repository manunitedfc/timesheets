import { CheckCircle2, ChevronDown, ChevronUp, Copy, Send, Trash2 } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
    Text as RNText,
    TextInput,
    View,
} from 'react-native';

import { Pressable } from '@/components/ui/pressable';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { TimesheetEntryRow, TimesheetStatus, TimesheetValidationErrors } from '@/types';

type TimesheetTotals = {
  hours: number;
  otHours: number;
  vacation: number;
  sick: number;
  fieldHours: number;
};

type TimesheetMobileViewProps = {
  entries: TimesheetEntryRow[];
  totals: TimesheetTotals;
  validationErrors: TimesheetValidationErrors;
  isReadOnly: boolean;
  status: TimesheetStatus;
  lastSavedAt: Date | null;
  onUpdateEntry: (date: string, field: keyof TimesheetEntryRow, value: string | number) => void;
  onCopyLastWeek: () => void;
  onClearWeek: () => void;
  onSubmit: () => void;
};

type FieldInputProps = {
  label: string;
  value: string;
  isDark: boolean;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'decimal-pad';
  width?: `${number}%`;
  onEndEditing?: () => void;
  onChangeText: (text: string) => void;
};

type NumberFieldInputProps = {
  label: string;
  value: number;
  date: string;
  field: keyof TimesheetEntryRow;
  isDark: boolean;
  error?: string;
  width?: `${number}%`;
  isReadOnly: boolean;
  draftValue?: string;
  onDraftChange: (date: string, field: keyof TimesheetEntryRow, value?: string) => void;
  onUpdate: (date: string, field: keyof TimesheetEntryRow, value: string | number) => void;
};

type DayCardProps = {
  row: TimesheetEntryRow;
  isOpen: boolean;
  isReadOnly: boolean;
  isDark: boolean;
  errors: Partial<Record<keyof TimesheetEntryRow, string>>;
  numericDrafts: Record<string, string>;
  onDraftChange: (date: string, field: keyof TimesheetEntryRow, value?: string) => void;
  onToggle: () => void;
  onUpdate: (date: string, field: keyof TimesheetEntryRow, value: string | number) => void;
};

const border = '#dbe3ec';
const muted = '#64748b';
const primary = '#0f172a';

function formatDate(row: TimesheetEntryRow) {
  const date = new Date(row.date);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDayTotal(row: TimesheetEntryRow) {
  const total = row.hours + row.otHours;
  const hours = Math.floor(total);
  const minutes = Math.round((total - hours) * 60);
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatSavedLabel(date: Date | null) {
  if (!date) return 'Not saved yet';

  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diff < 10) return 'Auto-saved just now';
  if (diff < 60) return `Auto-saved ${diff}s ago`;
  if (diff < 3600) return `Auto-saved ${Math.floor(diff / 60)}m ago`;

  return `Auto-saved at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

function FieldInput({
  label,
  value,
  isDark,
  placeholder,
  error,
  multiline = false,
  keyboardType = 'default',
  width = '100%',
  onEndEditing,
  onChangeText,
}: FieldInputProps) {

  return (
    <View style={{ width }}>
      <RNText style={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 8 }}>
        {label}
      </RNText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        onEndEditing={onEndEditing}
        style={{
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderColor: error ? '#ef4444' : isDark ? '#334155' : border,
          borderRadius: 8,
          borderWidth: 1,
          color: isDark ? '#f8fafc' : primary,
          fontSize: 15,
          minHeight: multiline ? 92 : 48,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
      {error ? (
        <RNText style={{ color: '#dc2626', fontSize: 11, lineHeight: 16, marginTop: 4 }}>{error}</RNText>
      ) : null}
    </View>
  );
}

function NumberFieldInput({
  label,
  value,
  date,
  field,
  isDark,
  error,
  width = '48%',
  isReadOnly,
  draftValue,
  onDraftChange,
  onUpdate,
}: NumberFieldInputProps) {
  return (
    <FieldInput
      label={label}
      value={draftValue ?? (value === 0 ? '' : String(value))}
      isDark={isDark}
      keyboardType="decimal-pad"
      placeholder="0"
      width={width}
      error={error}
      onChangeText={(text) => {
        if (isReadOnly) return;
        if (!/^\d*(\.\d*)?$/.test(text)) return;
        onDraftChange(date, field, text);

        if (text === '') {
          onUpdate(date, field, 0);
          return;
        }

        if (text.endsWith('.')) return;

        const parsed = Number(text);
        onUpdate(date, field, Number.isNaN(parsed) ? 0 : parsed);
      }}
      onEndEditing={() => {
        if (isReadOnly) return;
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
    />
  );
}

function DayCard({ row, isOpen, isReadOnly, isDark, errors, numericDrafts, onDraftChange, onToggle, onUpdate }: DayCardProps) {
  const isWeekend = row.day === 'Sat' || row.day === 'Sun';
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <View
      style={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderColor: isOpen ? (isDark ? '#1d4ed8' : '#bfdbfe') : (isDark ? '#334155' : border),
        borderLeftColor: isOpen ? '#2563eb' : (isDark ? '#334155' : border),
        borderLeftWidth: isOpen ? 3 : 1,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      }}
    >
      <Pressable
        onPress={onToggle}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          minHeight: 64,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <RNText style={{ color: isWeekend ? (isDark ? '#94a3b8' : muted) : (isDark ? '#f8fafc' : primary), fontSize: 17, fontWeight: '700', lineHeight: 24 }}>
            {row.day},{' '}
            <RNText style={{ color: isDark ? '#94a3b8' : muted, fontWeight: '600' }}>{formatDate(row)}</RNText>
          </RNText>
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
          {hasErrors ? <View style={{ backgroundColor: '#ef4444', borderRadius: 4, height: 8, width: 8 }} /> : null}
          <RNText style={{ color: isDark ? '#f8fafc' : primary, fontSize: 17, fontWeight: '700', lineHeight: 24 }}>
            {formatDayTotal(row)}
          </RNText>
          {isOpen ? <ChevronUp size={22} color="#2563eb" /> : <ChevronDown size={22} color={isDark ? '#94a3b8' : '#334155'} />}
        </View>
      </Pressable>

      {isOpen ? (
        <View style={{ paddingBottom: 18, paddingHorizontal: 16, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <NumberFieldInput label="Hours" value={row.hours} date={row.date} field="hours" isDark={isDark} error={errors.hours} isReadOnly={isReadOnly} draftValue={numericDrafts[`${row.date}:hours`]} onDraftChange={onDraftChange} onUpdate={onUpdate} />
            <NumberFieldInput label="OT Hours" value={row.otHours} date={row.date} field="otHours" isDark={isDark} error={errors.otHours} isReadOnly={isReadOnly} draftValue={numericDrafts[`${row.date}:otHours`]} onDraftChange={onDraftChange} onUpdate={onUpdate} />
            <NumberFieldInput label="Vacation" value={row.vacation} date={row.date} field="vacation" isDark={isDark} error={errors.vacation} isReadOnly={isReadOnly} draftValue={numericDrafts[`${row.date}:vacation`]} onDraftChange={onDraftChange} onUpdate={onUpdate} />
            <NumberFieldInput label="Sick" value={row.sick} date={row.date} field="sick" isDark={isDark} error={errors.sick} isReadOnly={isReadOnly} draftValue={numericDrafts[`${row.date}:sick`]} onDraftChange={onDraftChange} onUpdate={onUpdate} />
            <NumberFieldInput label="Field Hours" value={row.fieldHours} date={row.date} field="fieldHours" isDark={isDark} error={errors.fieldHours} isReadOnly={isReadOnly} draftValue={numericDrafts[`${row.date}:fieldHours`]} onDraftChange={onDraftChange} onUpdate={onUpdate} />
            <FieldInput
              label="Job # (Optional)"
              value={row.jobNumber}
              isDark={isDark}
              width="48%"
              placeholder="2456"
              onChangeText={(text) => {
                if (!isReadOnly) onUpdate(row.date, 'jobNumber', text);
              }}
            />
            <FieldInput
              label="Details (What did you work on?)"
              value={row.details}
              isDark={isDark}
              placeholder="Describe the work completed"
              multiline
              onChangeText={(text) => {
                if (!isReadOnly) onUpdate(row.date, 'details', text);
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

function FooterButton({
  children,
  icon,
  isDark,
  tone = 'default',
  flex = 1,
  onPress,
}: {
  children: string;
  icon: ReactNode;
  isDark: boolean;
  tone?: 'default' | 'primary' | 'danger';
  flex?: number;
  onPress: () => void;
}) {
  const isPrimary = tone === 'primary';
  const isDanger = tone === 'danger';
  const background = isPrimary ? '#2563eb' : isDanger ? (isDark ? '#3b0d0d' : '#fef2f2') : (isDark ? '#0f172a' : '#ffffff');
  const textColor = isPrimary ? '#ffffff' : isDanger ? '#dc2626' : primary;

  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: background,
        borderColor: isPrimary ? '#2563eb' : isDanger ? '#fca5a5' : (isDark ? '#334155' : border),
        borderRadius: 8,
        borderWidth: 1,
        flex,
        flexDirection: 'row',
        gap: 8,
        height: 48,
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}
    >
      {icon}
      <RNText style={{ color: isPrimary ? '#ffffff' : (isDanger ? '#dc2626' : (isDark ? '#f8fafc' : textColor)), fontSize: 13, fontWeight: '700', lineHeight: 18 }}>
        {children}
      </RNText>
    </Pressable>
  );
}

export function TimesheetMobileView({
  entries,
  totals,
  validationErrors,
  isReadOnly,
  lastSavedAt,
  onUpdateEntry,
  onCopyLastWeek,
  onClearWeek,
  onSubmit,
}: TimesheetMobileViewProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [openDate, setOpenDate] = useState<string | null>(entries[2]?.date ?? entries[0]?.date ?? null);
  const [clearPending, setClearPending] = useState(false);
  const [numericDrafts, setNumericDrafts] = useState<Record<string, string>>({});

  const handleDraftChange = (date: string, field: keyof TimesheetEntryRow, value?: string) => {
    const key = `${date}:${String(field)}`;
    setNumericDrafts((prev) => {
      const next = { ...prev };
      if (value === undefined) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleClear = () => {
    if (clearPending) {
      setClearPending(false);
      onClearWeek();
      return;
    }

    setClearPending(true);
    setTimeout(() => setClearPending(false), 3000);
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>


      {entries.map((row) => (
        <DayCard
          key={row.date}
          row={row}
          isOpen={openDate === row.date}
          isReadOnly={isReadOnly}
          isDark={isDark}
          errors={validationErrors[row.date] ?? {}}
          numericDrafts={numericDrafts}
          onDraftChange={handleDraftChange}
          onToggle={() => setOpenDate((current) => (current === row.date ? null : row.date))}
          onUpdate={onUpdateEntry}
        />
      ))}

      <View
        style={{
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderColor: isDark ? '#334155' : border,
          borderRadius: 8,
          borderWidth: 1,
          marginTop: 12,
          padding: 16,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <RNText style={{ color: isDark ? '#f8fafc' : primary, fontSize: 18, fontWeight: '700', lineHeight: 24 }}>Weekly Totals</RNText>
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
            <RNText style={{ color: isDark ? '#94a3b8' : muted, fontSize: 12, fontWeight: '500', lineHeight: 17 }}>
              {formatSavedLabel(lastSavedAt)}
            </RNText>
            <CheckCircle2 size={16} color="#10b981" />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 18 }}>
          {[
            { label: 'Hours', value: totals.hours },
            { label: 'OT Hours', value: totals.otHours },
            { label: 'Vacation', value: totals.vacation },
            { label: 'Sick', value: totals.sick },
            { label: 'Field', value: totals.fieldHours },
          ].map((item, index) => (
            <View
              key={item.label}
              style={{
                alignItems: 'center',
                borderLeftColor: isDark ? '#334155' : '#e2e8f0',
                borderLeftWidth: index === 0 ? 0 : 1,
                flex: 1,
                minWidth: 0,
              }}
            >
              <RNText style={{ color: isDark ? '#f8fafc' : primary, fontSize: 17, fontWeight: '700', lineHeight: 24 }}>
                {item.value.toFixed(2)}
              </RNText>
              <RNText style={{ color: isDark ? '#94a3b8' : muted, fontSize: 12, lineHeight: 17, marginTop: 4 }}>
                {item.label}
              </RNText>
            </View>
          ))}
        </View>

        {!isReadOnly ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <FooterButton isDark={isDark} icon={<Copy size={16} color={isDark ? '#cbd5e1' : '#334155'} />} onPress={onCopyLastWeek}>
              Copy
            </FooterButton>
            <FooterButton
              isDark={isDark}
              icon={<Trash2 size={16} color={clearPending ? '#dc2626' : isDark ? '#cbd5e1' : '#334155'} />}
              tone={clearPending ? 'danger' : 'default'}
              onPress={handleClear}
            >
              {clearPending ? 'Confirm' : 'Clear'}
            </FooterButton>
            <FooterButton isDark={isDark} icon={<Send size={16} color="#ffffff" />} tone="primary" flex={1.35} onPress={onSubmit}>
              Submit
            </FooterButton>
          </View>
        ) : null}
      </View>
    </View>
  );
}
