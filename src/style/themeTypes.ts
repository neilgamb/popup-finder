export {}

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      white: string
      gray: string
      black: string
      success: string
      info: string
      warning: string
    }

    interface Theme {
      withBorder: any
      boxShadow: any
      spacing: {
        xxl: number
        xl: number
        lg: number
        md: number
        sm: number
        xs: number
        xxs: number
      }
      typography: {
        h1: any
        h2: any
        h3: any
        h4: any
        body: any
        input: any
        caption: any
        button: any
        code: any
        link: any
      }
      presets: {
        screenContainer: any
        screenContent: any
        screenActions: any
        centered: any
      }
      palette: {
        primary: {
          60: string
          80: string
          100: string
          120: string
          140: string
        }
        accent: {
          60: string
          80: string
          100: string
          120: string
          140: string
        }
        neutral: {
          70: string
          80: string
          90: string
          100: string
          120: string
          140: string
          180: string
        }
        semantic: {
          success: string
          warning: string
          error: string
          info: string
        }
      }
    }
  }
}
