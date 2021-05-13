import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { List, Title, Text, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { Card, FAB, ScreenHeader } from '../../components'
import { useVendor, useEvents } from '../../hooks'
import { mapStyle } from '../../style/mapStyle'
import { withBorder } from '../../style/theme'

const VendorEvents = () => {
  const { presets, spacing, colors, roundness } = useTheme()
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

  useEffect(() => {
    console.log(events)
  }, [events])

  return (
    <SafeAreaView style={presets.screenContainer}>
      <ScreenHeader withAvatar />
      <ScrollView>
        {events.map((event, i) => {
          const lat = Number(event?.locationData?.geometry?.location?.lat)
          const lng = Number(event?.locationData?.geometry?.location?.lng)

          return (
            <Card key={i} style={{ marginTop: spacing.md }}>
              <View style={{ padding: spacing.sm }}>
                <Title style={presets.title}>
                  {format(event.eventDate.toDate(), 'eeee, LLLL do yyyy')}
                </Title>
                <Text style={{ fontSize: 16, color: colors.gray }}>
                  {event.locationData.name}
                </Text>
                <Text style={{ fontSize: 16, color: colors.gray }}>
                  {event.locationData.formatted_address}
                </Text>
              </View>
              <View
                style={{
                  borderRadius: roundness,
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                  overflow: 'hidden',
                }}
              >
                <MapView
                  style={{
                    flex: 1,
                    height: 120,
                  }}
                  scrollEnabled={false}
                  minZoomLevel={16}
                  zoomEnabled={false}
                  provider={PROVIDER_GOOGLE}
                  customMapStyle={mapStyle}
                  initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: lat,
                      longitude: lng,
                    }}
                    title={event.locationData.name}
                    description={event.locationData.name}
                  />
                </MapView>
              </View>
            </Card>
          )
        })}
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
