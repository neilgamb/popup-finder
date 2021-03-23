import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Landing, VendorSignIn, PatronSignIn } from '../screens'

const Stack = createStackNavigator()

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      // headerMode='none'
      >
        <Stack.Screen
          name='Landing'
          component={Landing}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='VendorSignIn' component={VendorSignIn} />
        <Stack.Screen name='PatronSignIn' component={PatronSignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
