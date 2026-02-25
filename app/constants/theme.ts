export const Colors = {
  background: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  primary: '#3B82F6',
  alert: '#EF4444',
  alertBg: 'rgba(239,68,68,0.15)',
  safe: '#10B981',
  safeBg: 'rgba(16,185,129,0.15)',
} as const;

export const LightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  primary: '#2563EB',
  alert: '#DC2626',
  alertBg: 'rgba(220,38,38,0.08)',
  safe: '#059669',
  safeBg: 'rgba(5,150,105,0.08)',
} as const;

export const Typography = {
  body: {
    fontFamily: 'Inter_400Regular' as const,
    fontSize: 16,
  },
  bodyMd: {
    fontFamily: 'Inter_500Medium' as const,
    fontSize: 16,
  },
  label: {
    fontFamily: 'Inter_600SemiBold' as const,
    fontSize: 14,
    color: '#94A3B8',
  },
  title: {
    fontFamily: 'Inter_600SemiBold' as const,
    fontSize: 20,
  },
  heading: {
    fontFamily: 'Inter_700Bold' as const,
    fontSize: 24,
  },
  large: {
    fontFamily: 'Inter_700Bold' as const,
    fontSize: 32,
  },
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
