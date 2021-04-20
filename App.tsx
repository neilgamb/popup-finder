import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Provider as ThemeProvider } from 'react-native-paper'

import AuthStack from './src/navigation/AuthStack'
import VendorStack from './src/navigation/VendorStack'
import PatronStack from './src/navigation/PatronStack'

import { useAuth } from './src/hooks'
import { theme } from './src/style/theme'

export default function App() {
  const { userIsAuthenticated, isVendor } = useAuth()

  const renderApp = () => {
    if (!userIsAuthenticated || isVendor === null) {
      return <AuthStack />
    } else if (userIsAuthenticated && isVendor) {
      return <VendorStack />
    } else if (userIsAuthenticated && !isVendor) {
      return <PatronStack />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <StatusBar style='dark' />
        {renderApp()}
      </View>
    </ThemeProvider>
  )
}
