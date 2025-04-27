export const colors = {
  primary: '#8A56AC',
  primaryLight: '#A67BC1',
  primaryDark: '#6A4084',
  secondary: '#56ACB2',
  background: '#F5F6FA',
  backgroundDark: '#17171F',
  white: '#FFFFFF',
  black: '#000000',
  text: '#17171F',
  textSecondary: '#6E6E7E',
  error: '#FF4D4F',
  success: '#52C41A',
  warning: '#FAAD14',
  gray: '#E5E5E5',
  grayLight: '#F0F0F0',
  grayDark: '#AEAEB2',
  transparent: 'transparent',

  // Achievement colors
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};

export const categoryColors = {
  work: {
    bg: '#A67BC1',
    text: '#FFFFFF',
  },
  code: {
    bg: '#FF7A7A',
    text: '#FFFFFF',
  },
  reading: {
    bg: '#56E0C0',
    text: '#17171F',
  },
  sport: {
    bg: '#FFA26B',
    text: '#17171F',
  },
  study: {
    bg: '#56ACB2',
    text: '#FFFFFF',
  },
  personal: {
    bg: '#7A85FF',
    text: '#FFFFFF',
  },
};

export default {
  light: {
    text: colors.text,
    background: colors.background,
    card: colors.white,
    primary: colors.primary,
    border: colors.gray,
    notification: colors.primary,
    textSecondary: colors.textSecondary,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
  },
  dark: {
    text: colors.white,
    background: colors.backgroundDark,
    card: '#252530',
    primary: colors.primary,
    border: '#2C2C3A',
    notification: colors.primary,
    textSecondary: '#9898A5',
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
  }
};