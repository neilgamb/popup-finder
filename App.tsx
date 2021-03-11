import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import AuthStack from './src/navigation/AuthStack'
import VendorStack from './src/navigation/VendorStack'
import PatronStack from './src/navigation/PatronStack'

import { useAuth } from './src/hooks/useAuth'

export default function App() {
  const { userIsAuthenticated, isVendor } = useAuth()

  const renderApp = () => {
    if (userIsAuthenticated && isVendor) {
      return <VendorStack />
    } else if (userIsAuthenticated && !isVendor) {
      return <PatronStack />
    } else {
      return <AuthStack />
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style='dark' />
      {renderApp()}
    </View>
  )
}
