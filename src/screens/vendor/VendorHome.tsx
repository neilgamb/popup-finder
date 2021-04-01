import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { Headline, Title, useTheme } from 'react-native-paper'

import { ScreenHeader } from '../../components'
import { useAuth } from '../../hooks/useAuth'

const VendorHome = () => {
  const { presets } = useTheme()
  const { userInfo } = useAuth()

  return (
    <SafeAreaView style={presets.screenContainer}>
      <View style={presets.screenContent}>
        <ScreenHeader />
        <Headline>Welcome, {userInfo?.displayName.split(' ')[0]}</Headline>
        <Title>
          Before you get started, tell us a little more about your pop up...
        </Title>
      </View>
    </SafeAreaView>
  )
}

export default VendorHome
