import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { VendorProfile, VendorEvents, VendorAddMenuItem } from '../screens'

import { useVendor } from '../hooks'

const Stack = createStackNavigator()

const modalOptions = {
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }
  },
  gestureResponseDistance: { vertical: 1000 },
}

export default function VendorStack() {
  const { isVendorSetup } = useVendor()
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode='none'
        screenOptions={{
          cardOverlayEnabled: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name='VendorEvents' component={VendorEvents} />
        <Stack.Screen
          name='VendorProfile'
          options={{
            ...modalOptions,
            gestureDirection: 'vertical',
            gestureEnabled: isVendorSetup ? true : false,
          }}
          component={VendorProfile}
        />
        <Stack.Screen
          name='VendorAddMenuItem'
          options={{
            ...modalOptions,
            gestureDirection: 'vertical',
            gestureEnabled: false,
          }}
          component={VendorAddMenuItem}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
