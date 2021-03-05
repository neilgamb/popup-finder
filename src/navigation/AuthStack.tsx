import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SignIn } from '../screens'

const Stack = createStackNavigator()

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      // headerMode='none'
      >
        <Stack.Screen name='SignIn' component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
