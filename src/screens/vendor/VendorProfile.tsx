import React, { useState, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { Avatar, useTheme } from 'react-native-paper'
import { useRoute } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'

import { DismissKeyboard } from '../../components'
import { VendorProfileInfo } from '../../screens'
import { theme } from '../../style/theme'

import ModalContainer from '../../navigation/ModalContainer'

const screenWidth = Dimensions.get('window').width
const sliderWidth = screenWidth
const itemWidth = screenWidth

interface Item {
  title: string
}

const VendorProfile = () => {
  const { presets, withBorder } = useTheme()
  const route = useRoute()
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<Carousel<Item>>(null)
  const menuIndicatorAnim = useRef(new Animated.Value(0)).current

  const renderItems = ({ item }) => <View style={{ flex: 1 }}>{item.comp}</View>

  useEffect(() => {
    carouselRef.current?.snapToItem(activeIndex)
    Animated.timing(menuIndicatorAnim, {
      toValue: activeIndex,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [activeIndex])

  return (
    <DismissKeyboard>
      <ModalContainer>
        <SafeAreaView style={presets.screenContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              style={styles.avatar}
              size={70}
              source={{ uri: route.params.activePopUp.logoImageUrl }}
            />
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setActiveIndex(0)}
            >
              <Text style={styles.menuButtonText}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setActiveIndex(1)}
            >
              <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.menuIndicatorContainer,
                {
                  transform: [
                    {
                      translateX: menuIndicatorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, screenWidth / 2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.menuIndicator} />
            </Animated.View>
          </View>
          <View style={{ flex: 1 }}>
            <Carousel
              layout='default'
              activeSlideAlignment='center'
              ref={carouselRef}
              scrollEnabled={false}
              inactiveSlideScale={1}
              data={[
                {
                  comp: (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // ...withBorder,
                      }}
                    >
                      <Text>Comp 1</Text>
                    </View>
                  ),
                },
                {
                  comp: (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // ...withBorder,
                      }}
                    >
                      <Text>Comp 2</Text>
                    </View>
                  ),
                },
              ]}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              renderItem={renderItems}
              onSnapToItem={setActiveIndex}
            />
          </View>
        </SafeAreaView>
      </ModalContainer>
    </DismissKeyboard>
  )
}

export default VendorProfile

const styles = StyleSheet.create({
  avatarContainer: {
    height: 120,
    width: 120,
    borderRadius: 100,
    backgroundColor: 'white',
    position: 'absolute',
    left: screenWidth / 2 - 60,
    top: -60,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'white',
  },
  menuContainer: {
    marginTop: 50,
    flexDirection: 'row',
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  menuButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  menuButtonText: {
    textAlign: 'center',
    fontSize: 18,
  },
  menuIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIndicator: {
    height: 2,
    width: 60,
    backgroundColor: 'black',
  },
})
