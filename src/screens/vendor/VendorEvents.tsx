import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { useTheme } from 'react-native-paper'

import { ScreenHeader } from '../../components'

const VendorEvents = () => {
  const { presets } = useTheme()

  return (
    <SafeAreaView style={presets.screenContainer}>
      <ScreenHeader />
      <View style={presets.screenContent}></View>
    </SafeAreaView>
  )
}

export default VendorEvents
