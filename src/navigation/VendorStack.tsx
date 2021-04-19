import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack'

import { VendorHome, VendorEvents, VendorMenu } from '../screens'
import { useVendor } from '../hooks/useVendor'

const Stack = createStackNavigator()

export default function VendorStack() {
  const { isVendorSetup } = useVendor()

  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode='none'
        initialRouteName={isVendorSetup ? 'VendorEvents' : 'VendorHome'}
      >
        <Stack.Screen name='VendorEvents' component={VendorEvents} />
        <Stack.Screen name='VendorHome' component={VendorHome} />
        <Stack.Screen name='VendorMenu' component={VendorMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
