export const palette = {
  background: '#fcfcf7',
  surface: '#ffffff',
  surfaceMuted: '#fff6fe',
  overlay: '#ddeaec',
  accent: '#ff6d4d',
  accentMuted: '#ffe1d7',
  textPrimary: '#191919',
  textSecondary: '#758696',
  textOnAccent: '#ffffff',
  border: '#ddeaec',
  borderStrong: '#c8c8c8',
  shadow: '0 40px 80px rgba(25, 25, 25, 0.08)'
} as const;

export const gradients = {
  accent: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.surfaceMuted} 100%)`,
  soft: `linear-gradient(135deg, rgba(255, 109, 77, 0.12) 0%, rgba(255, 246, 254, 0.6) 100%)`
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
