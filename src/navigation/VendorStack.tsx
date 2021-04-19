import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'

import { VendorProfile, VendorEvents, VendorMenuItems } from '../screens'

const Stack = createStackNavigator()

export default function VendorStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name='VendorEvents' component={VendorEvents} />
        <Stack.Screen
          name='VendorProfile'
          options={{
            title: 'Profile',
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
          component={VendorProfile}
        />

        <Stack.Screen name='VendorMenuItems' component={VendorMenuItems} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
