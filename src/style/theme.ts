import { StyleSheet } from 'react-native'
import { DefaultTheme, configureFonts } from 'react-native-paper'
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'

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

const SPACING = {
  xl: 64,
  lg: 32,
  md: 24,
  sm: 16,
  xs: 8,
  xxs: 4,
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

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      gray: string
      darkGray: string
      lightGray: string
      extraLightGray: string
      offWhite: string
    }

    interface Theme {
      presets: any
      withBorder: any
      spacing: any
      typography: any
    }
  }
}

export const theme = {
  ...DefaultTheme,
  roundness: 16,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#333',
    accent: '#E50006',
    gray: '#666',
    darkGray: '#333',
    lightGray: '#ccc',
    extraLightGray: '#f0f0f0',
    offWhite: '#f7f7f7',
  },
  spacing: {
    ...SPACING,
  },
  presets: StyleSheet.create({
    screenContainer: {
      flex: 1,
    },
    screenContent: {
      flex: 1,
      paddingHorizontal: SPACING.md,
    },
    screenActions: {
      paddingHorizontal: SPACING.md,
      paddingBottom: SPACING.xs,
    },
  }),
  typography: {
    h1: {
      ...fontConfig.default.medium,
      fontSize: 32,
      color: 'black',
    },
    h2: {
      ...fontConfig.default.medium,
      fontSize: 24,
      color: 'black',
    },
    h3: {
      ...fontConfig.default.medium,
      fontSize: 18,
      color: 'black',
    },
    body: {
      ...fontConfig.default.regular,
      fontSize: 16,
      color: '#666',
    },
    caption: {
      ...fontConfig.default.light,
      fontSize: 14,
      color: '#666',
    },
    button: {
      ...fontConfig.default.regular,
      fontSize: 18,
    },
  },
  fonts: configureFonts(fontConfig),
  withBorder,
  boxShadow,
}

export interface ThemeProps {
  theme: ReactNativePaper.Theme
}
