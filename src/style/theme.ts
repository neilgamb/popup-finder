import { StyleSheet } from 'react-native'
import { DefaultTheme, configureFonts } from 'react-native-paper'

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

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Arial',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Arial',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Arial',
      fontWeight: 'normal',
    },
    button: {
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontSize: 20,
    },
    input: {
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontSize: 18,
    },
  },
}

fontConfig.ios = fontConfig.default

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
    }

    interface ThemeFonts {
      input: any
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
  fonts: configureFonts(fontConfig),
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
  withBorder,
  boxShadow,
}
