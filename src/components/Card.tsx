import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { theme } from '../style/theme'

interface ProfileCardProps {
  children: React.ReactNode
  button?: boolean
  style?: any
}

const Card = ({ children, style, button }: ProfileCardProps) => {
  const [isPressed, setIsPressed] = useState(false)
  const pressedAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (button) {
      if (isPressed) {
        Animated.timing(pressedAnim, {
          toValue: 0,
          duration: 25,
          useNativeDriver: true,
        }).start()
      } else {
        Animated.timing(pressedAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }).start()
      }
    }
  }, [isPressed])

  return (
    <TouchableWithoutFeedback
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Animated.View
        style={{
          ...styles.profileCardContainer,
          ...style,
          shadowOpacity: pressedAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.01, 0.15],
          }),
          transform: [
            {
              scale: pressedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.995, 1],
              }),
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default Card

const styles = StyleSheet.create({
  profileCardContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.roundness,
    marginTop: theme.spacing.md,
    position: 'relative',
    ...theme.boxShadow,
  },
})
