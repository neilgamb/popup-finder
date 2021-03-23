import React from 'react'
import { TextInput as PaperTextInput, withTheme } from 'react-native-paper'

const TextInput = (props) => {
  const { fonts, spacing } = props.theme
  return (
    <PaperTextInput
      mode='outlined'
      {...props}
      style={{ ...fonts.input, marginTop: spacing.xs }}
    />
  )
}

export default withTheme(TextInput)
