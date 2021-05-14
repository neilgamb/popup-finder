import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { FAB, ScreenHeader, VendorEventCard } from '../../components'
import { useVendor, useEvents } from '../../hooks'

const VendorEvents = () => {
  const { presets } = useTheme()
  const { navigate } = useNavigation()
  const { activePopUp, isVendorSetup } = useVendor()
  const { getEvents, events } = useEvents()

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
      <ScrollView>
        {events && events.length ? (
          events.map((event, i) => <VendorEventCard key={i} event={event} />)
        ) : (
          <ActivityIndicator animating />
        )}
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
