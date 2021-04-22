import React, { useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { FAB, ScreenHeader } from '../../components'
import { useVendor } from '../../hooks'

const VendorEvents = () => {
  const { presets } = useTheme()
  const { navigate } = useNavigation()
  const { isVendorSetup } = useVendor()

  useEffect(() => {
    !isVendorSetup && navigate('VendorProfile')
  }, [isVendorSetup])

  return (
    <SafeAreaView style={presets.screenContainer}>
      <ScreenHeader withAvatar />
      <View style={presets.screenContent}></View>
      <FAB isOpen={false} icon='plus' onPress={() => console.log('Pressed')} />
    </SafeAreaView>
  )
}

export default VendorEvents
