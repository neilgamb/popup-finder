import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { Card, FAB, ScreenHeader } from '../../components'
import { useVendor, useEvents } from '../../hooks'

const VendorEvents = () => {
  const { presets } = useTheme()
  const { navigate } = useNavigation()
  const { isVendorSetup } = useVendor()
  const { getEvents } = useEvents()

  useEffect(() => {
    !isVendorSetup && navigate('VendorProfile')
  }, [isVendorSetup])

  useEffect(() => {
    const unsubscribeEvents = getEvents()

    return () => {
      unsubscribeEvents()
    }
  }, [])

  return (
    <SafeAreaView style={presets.screenContainer}>
      <ScreenHeader withAvatar />
      <View style={presets.screenContent}></View>
      <FAB
        isOpen={false}
        icon='plus'
        onPress={() => navigate('VendorAddEvent')}
      />
    </SafeAreaView>
  )
}

export default VendorEvents
