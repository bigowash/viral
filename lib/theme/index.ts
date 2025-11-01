export const palette = {
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceMuted: '#e8eaf6',
  overlay: '#c5cae9',
  accent: '#1a237e',
  accentMuted: '#e8eaf6',
  textPrimary: '#0a192f',
  textSecondary: '#64748b',
  textOnAccent: '#ffffff',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  shadow: '0 40px 80px rgba(25, 25, 25, 0.08)'
} as const;

export const gradients = {
  accent: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.surfaceMuted} 100%)`,
  soft: `linear-gradient(135deg, rgba(26, 35, 126, 0.12) 0%, rgba(232, 234, 246, 0.6) 100%)`
} as const;

export const radii = {
  xl: '32px',
  lg: '24px',
  md: '16px'
} as const;

export const theme = {
  palette,
  gradients,
  radii
} as const;

export type Theme = typeof theme;
