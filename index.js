import { registerRootComponent } from 'expo'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler' // needed for react-navigation

import App from './App'

registerRootComponent(App)
LogBox.ignoreAllLogs()
