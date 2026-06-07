/**
 * Design tokens — single source of truth for all color & theme classes.
 * Layout classes (p-*, gap-*, w-*, h-*) stay local to components.
 *
 * Usage:
 *   import { t } from '@/constants/tokens';
 *   <Text className={t.text.primary}>Hello</Text>
 */

export const t = {
  // ─── Text ────────────────────────────────────────────────────────────────
  text: {
    primary:   'text-slate-900 dark:text-white',
    secondary: 'text-slate-700 dark:text-slate-300',
    muted:     'text-slate-500 dark:text-slate-400',
    faint:     'text-slate-400 dark:text-slate-500',
    inverse:   'text-white',
    brand:     'text-blue-600 dark:text-blue-400',
    danger:    'text-red-600 dark:text-red-400',
    success:   'text-emerald-700 dark:text-emerald-400',
    warning:   'text-orange-700 dark:text-orange-400',
  },

  // ─── Backgrounds ─────────────────────────────────────────────────────────
  bg: {
    page:      'bg-slate-100 dark:bg-slate-950',
    surface:   'bg-white dark:bg-slate-900',
    elevated:  'bg-slate-50 dark:bg-slate-800',
    overlay:   'bg-slate-200 dark:bg-slate-700',
    brand:     'bg-blue-600',
    brandSoft: 'bg-blue-100 dark:bg-blue-900/40',
    danger:    'bg-red-600',
    dangerSoft:'bg-red-100 dark:bg-red-900/50',
    success:   'bg-emerald-600',
    successSoft:'bg-emerald-100 dark:bg-emerald-900/50',
    warningSoft:'bg-orange-100 dark:bg-orange-900/50',
    purpleSoft: 'bg-violet-100 dark:bg-violet-900/50',
  },

  // ─── Borders ─────────────────────────────────────────────────────────────
  border: {
    default:  'border-slate-200 dark:border-slate-700',
    strong:   'border-slate-300 dark:border-slate-600',
    subtle:   'border-slate-100 dark:border-slate-800',
  },

  // ─── Status badge pairs (bg + text) ──────────────────────────────────────
  status: {
    blue:   { bg: 'bg-blue-100 dark:bg-blue-900/50',     text: 'text-blue-700 dark:text-blue-300' },
    green:  { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/50',  text: 'text-orange-700 dark:text-orange-300' },
    red:    { bg: 'bg-red-100 dark:bg-red-900/50',        text: 'text-red-700 dark:text-red-300' },
    purple: { bg: 'bg-violet-100 dark:bg-violet-900/50',  text: 'text-violet-700 dark:text-violet-300' },
    slate:  { bg: 'bg-slate-100 dark:bg-slate-700',       text: 'text-slate-700 dark:text-slate-200' },
  },

  // ─── Card (combines border + surface for the most common card pattern) ────
  card: 'rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
} as const;
