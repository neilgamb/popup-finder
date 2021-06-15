import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { FAB, ScreenHeader, VendorEventCard } from '../../components'
import { useVendor, useEvents } from '../../hooks'

const VendorEvents = () => {
  const { presets, spacing } = useTheme()
  const { navigate } = useNavigation()
  const { activePopUp, isVendorSetup } = useVendor()
  const { getEvents, events } = useEvents()!

  useEffect(() => {
    !isVendorSetup && navigate('VendorProfile')
  }, [isVendorSetup])

  useEffect(() => {
    let unsubscribeEvents: any

    if (activePopUp) {
      unsubscribeEvents = getEvents(activePopUp.popUpUid)
    }

    return () => {
      if (activePopUp && unsubscribeEvents) {
        console.log('unsubscribing from events')
        unsubscribeEvents()
      }
    }
  }, [activePopUp])

  return (
    <SafeAreaView style={presets.screenContainer}>
      <ScreenHeader withAvatar />
      <ScrollView style={{ paddingHorizontal: spacing.md }}>
        {events.map((event, i) => (
          <VendorEventCard key={i} event={event} />
        ))}
      </ScrollView>
      <FAB
        isOpen={false}
        icon='plus'
        onPress={() => navigate('VendorAddEvent')}
      />
    </SafeAreaView>
  )
}

export default VendorEvents
