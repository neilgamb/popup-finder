import React from 'react'
import { StyleSheet } from 'react-native'
import { FAB as PaperFAB, withTheme } from 'react-native-paper'

type PaperTextInputProps = React.ComponentProps<typeof PaperFAB>

type FABProps = PaperTextInputProps & {
  theme: any
}

const TextInput = (props: FABProps) => {
  const { style: styleOverrides } = props
  return <PaperFAB {...props} style={[styles.fab, styleOverrides]} />
}

export default withTheme(TextInput)

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 48,
    right: 0,
    bottom: 0,
    transform: [{ scale: 1.2 }],
    backgroundColor: '#5d6c8c',
  },
})
