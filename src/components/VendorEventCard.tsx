import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { Title, Text, useTheme } from 'react-native-paper'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { format } from 'date-fns'

import { Card } from './index'
import { Event } from '../hooks/index'
import { mapStyle } from '../style/mapStyle'

interface Props {
  event: Event
}

const VendorEventCard = ({ event }: Props) => {
  const { presets, spacing, colors, roundness } = useTheme()
  const lat = Number(event?.locationData?.geometry?.location?.lat)
  const lng = Number(event?.locationData?.geometry?.location?.lng)

  return (
    <Card style={{ marginTop: spacing.md }}>
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
}

export default VendorEventCard
