import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { PatronHome } from '../screens'

const Stack = createStackNavigator()

export default function VendorStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name='Home' component={PatronHome} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
