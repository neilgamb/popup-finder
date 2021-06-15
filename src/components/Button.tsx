import React from 'react'
import { Button as PaperButton, withTheme } from 'react-native-paper'

import Text from './Text'
import { ThemeProps } from '../style/theme'

type PaperButtonProps = React.ComponentProps<typeof PaperButton>

type ButtonProps = ThemeProps &
  PaperButtonProps & {
    children: React.ReactNode
  }

const Button = (props: ButtonProps) => {
  const { spacing, typography, colors } = props.theme
  const { style, labelStyle, children, ...rest } = { ...props }

  let mode = props.mode || 'contained'

  return (
    <PaperButton
      mode={mode}
      contentStyle={{
        paddingVertical: props.mode === 'outlined' ? 0 : spacing.xxs,
      }}
      style={[
        {
          opacity: props.disabled ? 0.5 : 1,
          marginTop: spacing.xs,
          borderWidth: mode === 'outlined' ? 2 : 0,
          borderColor: colors.primary,
          width: '100%',
          maxWidth: 450,
        },
        props.style,
      ]}
      {...rest}
    >
      <Text
        style={[
          typography.button,
          {
            color:
              props.mode === 'text' || props.mode === 'outlined'
                ? colors.primary
                : 'white',
          },
          labelStyle,
        ]}
      >
        {children}
      </Text>
    </PaperButton>
  )
}

export default withTheme(Button)
