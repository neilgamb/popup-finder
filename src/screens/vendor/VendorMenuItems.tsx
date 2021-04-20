import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, Dimensions, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import BottomSheet from 'reanimated-bottom-sheet'

import { ScreenHeader, FAB } from '../../components'

const screenHeight = Dimensions.get('window').height

export default function VendorMenuItems() {
  const { presets, withBorder, spacing } = useTheme()
  const sheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)

  const toggleBottomSheet = () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (isOpen) {
      sheetRef?.current?.snapTo(0)
    } else {
      sheetRef?.current?.snapTo(1)
    }
  }, [isOpen])

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
      <Text>Swipe down to close</Text>
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
      <Text>Header</Text>
    </View>
  )

  return (
    <>
      <SafeAreaView style={presets.screenContainer}>
        <ScreenHeader withBackButton />
        <View style={presets.screenContent}></View>
      </SafeAreaView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={['50%', 0]}
        initialSnap={1}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onCloseEnd={() => setIsOpen(false)}
      />
      <FAB icon='plus' onPress={toggleBottomSheet} isOpen={isOpen} />
    </>
  )
}
