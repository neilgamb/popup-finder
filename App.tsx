import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Provider as ThemeProvider, configureFonts } from 'react-native-paper'
import AppLoading from 'expo-app-loading'
import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'

import AuthStack from './src/navigation/AuthStack'
import VendorStack from './src/navigation/VendorStack'
import PatronStack from './src/navigation/PatronStack'

import { useAuth } from './src/hooks'
import { theme, fontConfig } from './src/style/theme'

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

  let [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
  })

  const themeWithCustomFonts = {
    ...theme,
    fonts: configureFonts(fontConfig),
  }

  return !fontsLoaded ? (
    <AppLoading />
  ) : (
    <ThemeProvider theme={themeWithCustomFonts}>
      <View style={{ flex: 1 }}>
        <StatusBar style='dark' />
        {renderApp()}
      </View>
    </ThemeProvider>
  )
}
