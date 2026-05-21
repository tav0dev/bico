export type BicoTokens = {
  green: string;
  greenDark: string;
  greenSoft: string;
  purple: string;
  purpleSoft: string;
  orange: string;
  orangeSoft: string;
  navy: string;
  text: string;
  textMuted: string;
  textFaint: string;
  bg: string;
  bgSoft: string;
  border: string;
  borderSoft: string;
  red: string;
  redSoft: string;
};

export const bicoLightTokens: BicoTokens = {
  green: '#16A34A',
  greenDark: '#15803D',
  greenSoft: '#DCFCE7',
  purple: '#4338CA',
  purpleSoft: '#EEF2FF',
  orange: '#F97316',
  orangeSoft: '#FFEDD5',
  navy: '#1E293B',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  bg: '#FFFFFF',
  bgSoft: '#F8FAFC',
  border: '#E2E8F0',
  borderSoft: '#F1F5F9',
  red: '#DC2626',
  redSoft: '#FEE2E2',
};

export const bicoDarkTokens: BicoTokens = {
  green: '#22C55E',
  greenDark: '#16A34A',
  greenSoft: 'rgba(34, 197, 94, 0.15)',
  purple: '#818CF8',
  purpleSoft: 'rgba(129, 140, 248, 0.15)',
  orange: '#FB923C',
  orangeSoft: 'rgba(251, 146, 60, 0.15)',
  navy: '#1E293B',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  bg: '#0B1220',
  bgSoft: '#0F172A',
  border: '#1E293B',
  borderSoft: '#1E293B',
  red: '#F87171',
  redSoft: 'rgba(220, 38, 38, 0.18)',
};

export function resolveBicoTokens(isDark: boolean, accent: 'green' | 'purple'): BicoTokens {
  const base = isDark ? bicoDarkTokens : bicoLightTokens;

  if (accent === 'purple') {
    return {
      ...base,
      green: base.purple,
      greenDark: '#3730A3',
      greenSoft: base.purpleSoft,
      purple: base.green,
      purpleSoft: base.greenSoft,
    };
  }

  return base;
}

export function withAlpha(hex: string, opacity: number) {
  if (!hex.startsWith('#')) {
    return hex;
  }

  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((part) => part + part).join('')
    : normalized;

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
