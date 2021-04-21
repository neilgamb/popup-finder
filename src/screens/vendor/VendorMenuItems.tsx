import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { BottomSheet, ScreenHeader, FAB } from '../../components'

export default function VendorMenuItems() {
  const { presets, withBorder, spacing } = useTheme()
  const sheetRef = useRef<ReanimatedBottomSheet>(null)
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

  return (
    <>
      <SafeAreaView style={presets.screenContainer}>
        <ScreenHeader withBackButton />
        <View style={presets.screenContent}></View>
      </SafeAreaView>
      <FAB icon='plus' onPress={toggleBottomSheet} isOpen={isOpen} />
      <BottomSheet
        ref={sheetRef}
        header='test'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
