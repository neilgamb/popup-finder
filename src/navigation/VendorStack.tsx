import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { VendorProfile, VendorEvents, VendorMenuItems } from '../screens'

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
          options={{ ...modalOptions, gestureDirection: 'vertical' }}
          component={VendorProfile}
        />

        <Stack.Screen name='VendorMenuItems' component={VendorMenuItems} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
