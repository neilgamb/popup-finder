import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'

import { ScreenHeader, FAB } from '../../components'

export default function VendorMenuItems() {
  const { presets } = useTheme()

  return (
    <SafeAreaView style={presets.screenContainer}>
      <ScreenHeader />
      <View style={presets.screenContent}></View>
      <FAB icon='plus' onPress={() => console.log('Pressed')} />
    </SafeAreaView>
  )
}
