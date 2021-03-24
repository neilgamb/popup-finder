import React from 'react'
import { TextInput as PaperTextInput, withTheme } from 'react-native-paper'

type PaperTextInputProps = React.ComponentProps<typeof PaperTextInput>

type TextInputProps = PaperTextInputProps & {
  theme: any
}

const TextInput = (props: TextInputProps) => {
  const { fonts, spacing } = props.theme
  return (
    <PaperTextInput
      mode='outlined'
      style={{ ...fonts.input, marginTop: spacing.xs }}
      {...props}
    />
  )
}

export default withTheme(TextInput)
