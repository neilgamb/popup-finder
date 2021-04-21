import React, { forwardRef } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Title } from 'react-native-paper'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { theme } from '../style/theme'

type BottomSheetProps = {
  header: string
  onClose: () => void
}

const screenHeight = Dimensions.get('window').height

const BottomSheet = forwardRef(
  (props: BottomSheetProps, ref: React.Ref<ReanimatedBottomSheet>) => {
    const { withBorder } = theme

    const { header } = props

    const renderContent = () => (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: screenHeight,
          zIndex: 9,
          ...withBorder,
        }}
      >
        <Title>Swipe down to close</Title>
      </View>
    )

    const renderHeader = () => (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          zIndex: 9,
          ...withBorder,
          borderBottomWidth: 0,
        }}
      >
        <Title>{header}</Title>
      </View>
    )

    return (
      <ReanimatedBottomSheet
        {...props}
        ref={ref}
        snapPoints={['50%', 0]}
        initialSnap={1}
        renderHeader={renderHeader}
        renderContent={renderContent}
      />
    )
  }
)

export default BottomSheet
