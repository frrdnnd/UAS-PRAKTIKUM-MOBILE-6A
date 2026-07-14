// Design token tema "Aurora" (indigo-violet premium).
// Dilarang hardcode warna/ukuran acak di komponen — selalu ambil dari sini.

export const colors = {
  background: '#F6F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F1F8',
  border: '#ECECF4',
  primary: '#5B4BF5',
  primaryLight: '#EEEBFF',
  gradient: ['#6D5DF6', '#9B8CFA'], // hero, tombol utama, header
  accent: '#FF6B6B', // badge diskon (HEMAT)
  rating: '#FFB020',
  success: '#22C55E',
  danger: '#EF4444',
  textPrimary: '#14142B',
  textSecondary: '#6E6E87',
  textTertiary: '#9A9AB0',
  white: '#FFFFFF',
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// Skala tipografi. fontFamily di-set dinamis; gunakan helper `font()`.
export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '800', family: 'Jakarta_800ExtraBold' },
  h1: { fontSize: 22, lineHeight: 28, fontWeight: '700', family: 'Jakarta_700Bold' },
  h2: { fontSize: 18, lineHeight: 24, fontWeight: '700', family: 'Jakarta_700Bold' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500', family: 'Jakarta_500Medium' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500', family: 'Jakarta_500Medium' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', family: 'Jakarta_600SemiBold' },
};

// Shadow halus & berlapis (indigo, bukan hitam pekat).
export const shadow = {
  soft: {
    shadowColor: '#5B4BF5',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  card: {
    shadowColor: '#5B4BF5',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  strong: {
    shadowColor: '#5B4BF5',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};

export const theme = { colors, radius, spacing, typography, shadow };
export default theme;
