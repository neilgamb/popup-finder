import React, { useState, forwardRef, useRef, useEffect } from 'react'
import { Animated, Dimensions, Keyboard, StyleSheet, View } from 'react-native'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { Text } from '../components'
import { theme } from '../style/theme'

type BottomSheetProps = {
  header: string
  content: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const screenHeight = Dimensions.get('window').height

const BottomSheet = forwardRef(
  (props: BottomSheetProps, ref: React.Ref<ReanimatedBottomSheet>) => {
    const { header, content, onClose, isOpen } = props
    const bgOpacityAnim = useRef(new Animated.Value(0)).current
    // const bottomSheetOffset = useRef(new Animated.Value(0)).current

    const [showBg, setShowBg] = useState(false)

    const toggleBgColor = (isOpen: boolean) => {
      Animated.timing(bgOpacityAnim, {
        toValue: isOpen ? 0.5 : 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        if (!isOpen) {
          setShowBg(false)
        }
      })
    }

    useEffect(() => {
      if (isOpen) {
        setShowBg(true)
      }
      toggleBgColor(isOpen)
    }, [isOpen])

    // useEffect(() => {
    //   const keyboardDidShowListener = Keyboard.addListener(
    //     'keyboardDidShow',
    //     () => {
    //       Animated.timing(bottomSheetOffset, {
    //         toValue: 1,
    //         duration: 150,
    //         useNativeDriver: true,
    //       }).start()
    //     }
    //   )
    //   const keyboardDidHideListener = Keyboard.addListener(
    //     'keyboardDidHide',
    //     () => {
    //       Animated.timing(bottomSheetOffset, {
    //         toValue: 0,
    //         duration: 150,
    //         useNativeDriver: true,
    //       }).start()
    //     }
    //   )

    //   return () => {
    //     keyboardDidHideListener.remove()
    //     keyboardDidShowListener.remove()
    //   }
    // }, [])

    return (
      <>
        <ReanimatedBottomSheet
          {...props}
          ref={ref}
          snapPoints={['70%', 0]}
          initialSnap={1}
          onCloseStart={() => {
            Keyboard.dismiss()
            onClose()
          }}
          renderHeader={() => (
            <View style={styles.headerContainer}>
              <View style={styles.handleContainer}>
                <View style={styles.headerHandle} />
              </View>
              <Text>{header}</Text>
            </View>
          )}
          renderContent={() => (
            <View style={styles.contentContainer}>{content}</View>
          )}
        />
        {showBg && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'black', opacity: bgOpacityAnim },
            ]}
          />
        )}
      </>
    )
  }
)

export default BottomSheet

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    zIndex: 9,
    borderBottomWidth: 0,
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
    position: 'relative',
  },
  handleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerHandle: {
    backgroundColor: theme.colors.gray,
    width: 70,
    height: 3,
    borderRadius: 5,
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingHorizontal: theme.spacing.md,
    height: screenHeight,
    zIndex: 9,
  },
})
