import React, { useState, useEffect, useRef } from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import { Title, Text, useTheme } from 'react-native-paper'
import { format } from 'date-fns'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Carousel from 'react-native-snap-carousel'

import { Card } from './index'
import { Event } from '../hooks/index'
import { mapStyle } from '../style/mapStyle'

const screenWidth = Dimensions.get('window').width
const sliderWidth = screenWidth

interface Props {
  event: Event
}

interface Item {
  title: string
}

const VendorEventCard = ({ event }: Props) => {
  const { spacing, colors } = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselRef = useRef<Carousel<Item>>(null)

  const lat = Number(event?.locationData?.geometry?.location?.lat)
  const lng = Number(event?.locationData?.geometry?.location?.lng)

  const renderItems = ({ item }) => <View style={{ flex: 1 }}>{item}</View>

  useEffect(() => {
    carouselRef.current?.snapToItem(activeIndex)
  }, [activeIndex])

  return (
    <Card style={{ marginTop: spacing.md }}>
      <Carousel
        layout='default'
        activeSlideAlignment='center'
        ref={carouselRef}
        inactiveSlideScale={1}
        data={[
          <EventInfo event={event} />,
          <View style={{ flex: 1, height: 200, backgroundColor: 'blue' }} />,
        ]}
        swipeThreshold={1}
        sliderWidth={sliderWidth - spacing.md * 2}
        itemWidth={sliderWidth - spacing.md * 2}
        enableMomentum
        lockScrollWhileSnapping
        renderItem={renderItems}
        onSnapToItem={setActiveIndex}
      />
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => setActiveIndex(0)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: spacing.sm,
            backgroundColor:
              activeIndex === 0 ? colors.extraLightGray : 'white',
          }}
        >
          <Text>DETAILS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveIndex(1)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: spacing.sm,
            backgroundColor:
              activeIndex === 1 ? colors.extraLightGray : 'white',
          }}
        >
          <Text>MENU</Text>
        </TouchableOpacity>
      </View>
    </Card>
  )
}

export default VendorEventCard

const EventInfo = ({ event }: Props) => {
  const { presets, spacing, colors } = useTheme()
  const lat = Number(event?.locationData?.geometry?.location?.lat)
  const lng = Number(event?.locationData?.geometry?.location?.lng)

  return (
    <>
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
    </>
  )
}
