import React from 'react'
import { registerRootComponent } from 'expo'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler' // needed for react-navigation

import App from './App'
import { AuthProvider } from './src/hooks/useAuth'

const AppContainer = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)

registerRootComponent(AppContainer)
LogBox.ignoreAllLogs()
