import { Platform, StyleSheet } from 'react-native'
import { DefaultTheme, configureFonts } from 'react-native-paper'
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'

import palette from './palette'

export const appFonts = {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
}

export const withBorder = {
  borderWidth: 1,
  borderColor: 'black',
}

export const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 8,
}

//@ts-ignore
const isTablet = Platform.isPad

const SPACING = {
  xxl: 64,
  xl: 32,
  lg: 24,
  md: 16,
  sm: 8,
  xs: 4,
  xxs: 2,
}

export const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Nunito_400Regular',
      fontWeight: '400' as '400',
    },
    medium: {
      fontFamily: 'Nunito_600SemiBold',
      fontWeight: '600' as '600',
    },
    light: {
      fontFamily: 'Nunito_300Light',
      fontWeight: '400' as '400',
    },
    thin: {
      fontFamily: 'Nunito_300Light',
      fontWeight: '400' as '400',
    },
  },
}

// @ts-ignore
fontConfig.ios = fontConfig.default
// @ts-ignore
fontConfig.android = fontConfig.default

export const theme = {
  ...DefaultTheme,
  // CUSTOM GLOBAL STYLES
  roundness: 16,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    error: palette.semantic.error,
    info: palette.semantic.info,
    warning: palette.semantic.warning,
    success: palette.semantic.success,
    primary: palette.primary[100],
    accent: palette.accent[100],
    white: palette.neutral[70],
    gray: palette.neutral[100],
    black: palette.neutral[180],
    background: palette.neutral[70],
    text: palette.neutral[180],
  },
  palette,
  spacing: {
    ...SPACING,
  },
  presets: StyleSheet.create({
    screenContainer: {
      flex: 1,
      // backgroundColor: palette.neutral[70],
    },
    screenContent: {
      flex: 1,
      paddingHorizontal: isTablet ? SPACING.xl : SPACING.md,
    },
    screenActions: {
      paddingHorizontal: isTablet ? SPACING.xl : SPACING.md,
      paddingBottom: isTablet ? SPACING.xl : SPACING.md,
      alignItems: 'center',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
  typography: {
    h1: {
      ...fontConfig.default.medium,
      fontSize: 36,
      color: palette.neutral[180],
    },
    h2: {
      ...fontConfig.default.medium,
      fontSize: 32,
      color: palette.neutral[180],
    },
    h3: {
      ...fontConfig.default.medium,
      fontSize: 26,
      color: palette.neutral[180],
    },
    h4: {
      ...fontConfig.default.medium,
      fontSize: 18,
      color: palette.neutral[180],
    },
    body: {
      ...fontConfig.default.regular,
      fontSize: 18,
      color: palette.neutral[140],
    },
    caption: {
      ...fontConfig.default.regular,
      fontSize: 14,
      color: palette.neutral[140],
    },
    button: {
      ...fontConfig.default.medium,
      textTransform: 'none',
      fontSize: 18,
    },
    input: {
      ...fontConfig.default.regular,
      fontSize: 18,
      color: palette.neutral[140],
    },
    code: {
      fontFamily: 'Courier',
      fontWeight: '600',
    },
    link: {
      color: palette.primary[60],
      ...fontConfig.default.medium,
    },
  },
  withBorder,
  boxShadow,
  fonts: configureFonts(fontConfig),
}

export interface ThemeProps {
  theme: ReactNativePaper.Theme
}
