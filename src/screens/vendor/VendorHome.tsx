import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { useTheme } from 'react-native-paper'

import { ScreenHeader } from '../../components'

const VendorHome = () => {
  const { presets } = useTheme()

  return (
    <SafeAreaView style={presets.screenContainer}>
      <View style={presets.screenContent}>
        <ScreenHeader />
      </View>
    </SafeAreaView>
  )
}

export default VendorHome
