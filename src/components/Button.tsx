import React from 'react'
import { Button as PaperButton, withTheme } from 'react-native-paper'

type PaperButtonProps = React.ComponentProps<typeof PaperButton>

type ButtonProps = PaperButtonProps & {
  theme: any
}

const Button = (props: ButtonProps) => {
  const { fonts, spacing } = props.theme
  const { style, ...rest } = { ...props }

  return (
    <PaperButton
      dark
      mode='contained'
      style={[
        {
          opacity: props.disabled ? 0.5 : 1,
          marginTop: spacing.xs,
        },
        props.style,
      ]}
      contentStyle={{ paddingVertical: 8 }}
      labelStyle={fonts.button}
      {...rest}
    />
  )
}

export default withTheme(Button)
