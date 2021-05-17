import React from 'react'
import { Button as PaperButton, withTheme } from 'react-native-paper'

type PaperButtonProps = React.ComponentProps<typeof PaperButton>

type ButtonProps = PaperButtonProps & {
  theme: any
  dense?: boolean
}

const Button = (props: ButtonProps) => {
  const { spacing, typography } = props.theme
  const { style, labelStyle, dense, ...rest } = { ...props }

  return (
    <PaperButton
      dark
      mode='contained'
      labelStyle={[typography.button, labelStyle]}
      contentStyle={{ paddingVertical: dense ? 0 : spacing.xxs }}
      style={[
        {
          opacity: props.disabled ? 0.5 : 1,
          marginTop: spacing.xs,
        },
        props.style,
      ]}
      {...rest}
    />
  )
}

export default withTheme(Button)
