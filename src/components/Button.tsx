import React from 'react'
import { Button as PaperButton, withTheme } from 'react-native-paper'

const Button = (props) => {
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
