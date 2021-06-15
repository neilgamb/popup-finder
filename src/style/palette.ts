import Color from 'color'

const primary_base = '#1f778f'
const accent_base = '#E53C6D'
const neutral_base = '#BBB'

const success = '#5dd4a4'
const warning = '#edac34'
const error = '#e33927'
const info = '#8db3f0'

export default {
  primary: {
    60: Color(primary_base).lighten(0.4).hex(),
    80: Color(primary_base).lighten(0.2).hex(),
    100: primary_base,
    120: Color(primary_base).darken(0.2).hex(),
    140: Color(primary_base).darken(0.4).hex(),
  },
  accent: {
    60: Color(accent_base).lighten(0.4).hex(),
    80: Color(accent_base).lighten(0.2).hex(),
    100: accent_base,
    120: Color(accent_base).darken(0.2).hex(),
    140: Color(accent_base).darken(0.4).hex(),
  },
  semantic: { success, warning, error, info },
  neutral: {
    70: Color(neutral_base).lighten(0.3).hex(),
    80: Color(neutral_base).lighten(0.2).hex(),
    90: Color(neutral_base).lighten(0.1).hex(),
    100: neutral_base,
    120: Color(neutral_base).darken(0.2).hex(),
    140: Color(neutral_base).darken(0.4).hex(),
    180: Color(neutral_base).darken(0.8).hex(),
  },
}
