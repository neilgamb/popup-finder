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

export const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
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

export const presets = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  screenActions: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    // ...withBorder,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 30,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    marginRight: 5,
  },
})
