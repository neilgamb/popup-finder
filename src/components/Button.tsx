import React from 'react'
import { Button as PaperButton, withTheme } from 'react-native-paper'

type PaperButtonProps = React.ComponentProps<typeof PaperButton>

type ButtonProps = PaperButtonProps & {
  theme: any
}

const Button = (props: ButtonProps) => {
  const { fonts, spacing } = props.theme
  return (
    <PaperButton
      dark
      mode='contained'
      style={{ marginTop: spacing.xs }}
      contentStyle={{ paddingVertical: 8 }}
      labelStyle={fonts.button}
      {...props}
    />
  )
}

export default withTheme(Button)
