import React, { useRef, useEffect } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { FAB as PaperFAB, withTheme } from 'react-native-paper'

type PaperTextInputProps = React.ComponentProps<typeof PaperFAB>

type FABProps = PaperTextInputProps & {
  theme: any
  isOpen: boolean
}

const TextInput = (props: FABProps) => {
  const { style: styleOverrides } = props

  const rotationAnim = useRef(new Animated.Value(0)).current

  const toggleRotation = (isOpen: boolean) => {
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    toggleRotation(props.isOpen)
  }, [props.isOpen])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              rotate: rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg'],
              }),
            },
          ],
        },
      ]}
    >
      <PaperFAB {...props} style={[styles.fab, styleOverrides]} />
    </Animated.View>
  )
}

export default withTheme(TextInput)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 110,
    padding: 32,
    marginBottom: 16,
  },
  fab: {
    transform: [{ scale: 1.2 }],
    backgroundColor: '#5d6c8c',
  },
})
