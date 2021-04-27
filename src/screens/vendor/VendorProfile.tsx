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
import { Avatar, Title, useTheme } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import auth from '@react-native-firebase/auth'

import { Button, DismissKeyboard } from '../../components'
import { VendorProfileInfo } from '../../screens'
import { useVendor } from '../../hooks'
import { theme } from '../../style/theme'

import ModalContainer from '../../navigation/ModalContainer'

const screenWidth = Dimensions.get('window').width
const sliderWidth = screenWidth
const itemWidth = screenWidth

interface Item {
  title: string
}

const VendorProfile = () => {
  const { presets, spacing, colors, withBorder } = useTheme()
  const route = useRoute()
  const { navigate, goBack } = useNavigation()
  const [activeIndex, setActiveIndex] = useState(0)

  const { resetVendor } = useVendor()

  const carouselRef = useRef<Carousel<Item>>(null)
  const menuIndicatorAnim = useRef(new Animated.Value(0)).current

  const signOut = async () => {
    try {
      await auth().signOut()
      resetVendor()
    } catch (e) {
      console.error(e)
    }
  }

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
              <Text style={styles.menuButtonText}>INFO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setActiveIndex(1)}
            >
              <Text style={styles.menuButtonText}>MENU</Text>
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
              // scrollEnabled={false}
              inactiveSlideScale={1}
              data={[
                {
                  comp: (
                    <View
                      style={{
                        flex: 1,
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // ...withBorder,
                      }}
                    >
                      <VendorProfileInfo />
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
                        ...withBorder,
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
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: spacing.lg,
              paddingTop: 16,
            }}
          >
            <Button
              mode='text'
              style={{ flex: 1, marginRight: spacing.xs }}
              labelStyle={{ fontSize: 18, color: colors.gray }}
              icon='logout'
              onPress={signOut}
            >
              Log Out
            </Button>
            <Button
              mode='text'
              style={{ flex: 1, marginLeft: spacing.xs }}
              labelStyle={{ fontSize: 18, color: colors.gray }}
              icon='chevron-double-down'
              onPress={goBack}
            >
              Dismiss
            </Button>
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
    marginTop: 30,
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
    color: theme.colors.gray,
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
    backgroundColor: theme.colors.gray,
  },
})
