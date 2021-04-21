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
          onCloseStart={onClose}
          renderHeader={() => (
            <View style={styles.headerContainer}>
              <View style={styles.handleContainer}>
                <View style={styles.headerHandle} />
              </View>
              <Title>{header}</Title>
            </View>
          )}
          renderContent={() => (
            <View style={styles.contentContainer}>
              {/* <Title>{header}</Title> */}
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
    padding: theme.spacing.md,
    paddingTop: 32,
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
    padding: theme.spacing.lg,
    height: screenHeight,
    zIndex: 9,
  },
})
