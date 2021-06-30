import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Provider as ThemeProvider } from 'react-native-paper'
import AppLoading from 'expo-app-loading'
import { useFonts } from '@expo-google-fonts/nunito'

import AuthStack from './src/navigation/AuthStack'
import VendorStack from './src/navigation/VendorStack'
import PatronStack from './src/navigation/PatronStack'

import { useAuth } from './src/hooks'
import { theme, appFonts } from './src/style/theme'

export default function App() {
  const { userIsAuthenticated, isVendor } = useAuth()

  let [fontsLoaded] = useFonts(appFonts)

  console.log(fontsLoaded)

  return !fontsLoaded ? (
    <AppLoading />
  ) : (
    <ThemeProvider theme={theme}>
      <View style={{ flex: 1 }}>
        <StatusBar style='auto' />
        {!userIsAuthenticated || isVendor === null ? (
          <AuthStack />
        ) : userIsAuthenticated && isVendor ? (
          <VendorStack />
        ) : (
          <PatronStack />
        )}
      </View>
    </ThemeProvider>
  )
}
