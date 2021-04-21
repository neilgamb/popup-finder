import React, { useState, forwardRef, useRef, useEffect } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { Title } from 'react-native-paper'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { theme } from '../style/theme'

type BottomSheetProps = {
  header: string
  isOpen: boolean
  onClose: () => void
}

const screenHeight = Dimensions.get('window').height

const BottomSheet = forwardRef(
  (props: BottomSheetProps, ref: React.Ref<ReanimatedBottomSheet>) => {
    const { header, onClose, isOpen } = props
    const bgOpacityAnim = useRef(new Animated.Value(0)).current

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

    return (
      <>
        <ReanimatedBottomSheet
          {...props}
          ref={ref}
          snapPoints={['50%', 0]}
          initialSnap={1}
          onCloseEnd={onClose}
          renderHeader={() => (
            <View style={styles.headerContainer}>
              <Title>{header}</Title>
            </View>
          )}
          renderContent={() => (
            <View style={styles.contentContainer}>
              <Title>{header}</Title>
            </View>
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
    padding: 16,
    zIndex: 9,
    ...theme.withBorder,
    borderBottomWidth: 0,
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 16,
    height: screenHeight,
    zIndex: 9,
    ...theme.withBorder,
  },
})
