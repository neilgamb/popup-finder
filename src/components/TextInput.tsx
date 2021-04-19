import React from 'react'
import { TextInput as PaperTextInput, withTheme } from 'react-native-paper'

type PaperTextInputProps = React.ComponentProps<typeof PaperTextInput>

type TextInputProps = PaperTextInputProps & {
  theme: any
}

const TextInput = (props: TextInputProps) => {
  const { fonts, spacing } = props.theme
  const { style: styleOverrides } = props
  return (
    <PaperTextInput
      {...props}
      mode='outlined'
      style={[{ ...fonts.input, marginTop: spacing.sm }, styleOverrides]}
    />
  )
}

export default withTheme(TextInput)
