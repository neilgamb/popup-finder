import { StyleSheet } from 'react-native'
import { DefaultTheme, configureFonts } from 'react-native-paper'

export const withBorder = {
  borderWidth: 1,
  borderColor: 'black',
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
      fontSize: 20,
    },
  },
}

fontConfig.ios = fontConfig.default

declare global {
  namespace ReactNativePaper {
    // interface ThemeColors {
    //   myOwnColor: string
    // }

    interface Theme {
      // myOwnProperty: boolean
      presets: any
    }
  }
}

export const theme = {
  ...DefaultTheme,
  roundness: 16,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5d6c8c',
    accent: 'cyan',
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
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.md,
    },
  }),
}
