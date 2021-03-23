import React from 'react'
import { registerRootComponent } from 'expo'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler' // needed for react-navigation

import App from './App'
import { AuthProvider, VendorProvider } from './src/hooks'

const composeProviders = (...Providers) => (Child) => (props) =>
  Providers.reduce(
    (acc, Provider) => <Provider>{acc}</Provider>,
    <Child {...props} />
  )

const AppContainer = composeProviders(AuthProvider, VendorProvider)(App)

registerRootComponent(AppContainer)
LogBox.ignoreAllLogs()
