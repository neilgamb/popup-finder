import React, { useState, useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton, Title, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Carousel from 'react-native-snap-carousel'

import { Card, Text } from './index'
import { Event } from '../hooks/index'
import { mapStyle } from '../style/mapStyle'
import { MENU_ITEM_CATEGORIES } from '../utils/constants'
import { theme, withBorder } from '../style/theme'

const screenWidth = Dimensions.get('window').width
const sliderWidth = screenWidth

interface Props {
  event: Event
}

const VendorEventCard = ({ event }: Props) => {
  const { spacing, colors, palette } = useTheme()
  const { navigate } = useNavigation()
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselRef = useRef<Carousel<React.ReactNode>>(null)

  const renderItems = ({ item }: { item: React.ReactNode }) => (
    <View style={{ flex: 1 }}>{item}</View>
  )

  useEffect(() => {
    carouselRef.current?.snapToItem(activeIndex)
  }, [activeIndex])

  return (
    <Card style={{ marginTop: spacing.md }}>
      <IconButton
        icon='pencil'
        style={styles.editButton}
        color={colors.gray}
        size={20}
        onPress={() =>
          navigate('VendorAddEvent', {
            isEditing: true,
            event,
          })
        }
      />
      <Carousel
        layout='default'
        activeSlideAlignment='center'
        ref={carouselRef}
        inactiveSlideScale={1}
        data={[<EventInfo event={event} />, <EventMenu event={event} />]}
        swipeThreshold={1}
        sliderWidth={sliderWidth - spacing.md * 2}
        itemWidth={sliderWidth - spacing.md * 2}
        enableMomentum
        scrollEnabled={false}
        lockScrollWhileSnapping
        renderItem={renderItems}
        onSnapToItem={setActiveIndex}
      />
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          disabled={activeIndex === 0}
          onPress={() => setActiveIndex(0)}
          style={{
            ...styles.cardNavButton,
            backgroundColor: activeIndex === 0 ? palette.neutral[70] : 'white',
          }}
        >
          <Text>DETAILS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={activeIndex === 1}
          onPress={() => setActiveIndex(1)}
          style={{
            ...styles.cardNavButton,
            backgroundColor: activeIndex === 1 ? palette.neutral[70] : 'white',
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
  const { spacing } = useTheme()
  const lat = Number(event?.locationData?.geometry?.location?.lat)
  const lng = Number(event?.locationData?.geometry?.location?.lng)

  return (
    <>
      <View style={{ padding: spacing.md }}>
        <Text h4>{format(event.eventDate.toDate(), 'eeee, LLLL do yyyy')}</Text>
        <Text>{event.locationData.name}</Text>
        <Text>{event.locationData.formatted_address}</Text>
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
        region={{
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

const EventMenu = ({ event }: Props) => {
  const { spacing, colors } = useTheme()

  return (
    <View style={styles.menuContainer}>
      {MENU_ITEM_CATEGORIES.map((cat, catIndex) => {
        return (
          event.menu.some((menuItem) => menuItem.category === cat.value) && (
            <View
              key={catIndex}
              style={{
                marginBottom: spacing.sm,
                marginRight: spacing.sm,
              }}
            >
              <Text h4>{cat.label}</Text>
              {event.menu
                .filter((menuItem) => menuItem.category === cat.value)
                .map((menuItem, menuItemIndex) => (
                  <Text key={menuItemIndex}>{menuItem.name}</Text>
                ))}
            </View>
          )
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  editButton: {
    position: 'absolute',
    right: theme.spacing.xxs,
    top: theme.spacing.xxs,
    zIndex: 1,
  },
  cardNavButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  menuContainer: {
    padding: theme.spacing.md,
    width: '90%',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxHeight: 200,
    overflow: 'hidden',
  },
})
