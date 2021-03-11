import React from 'react'

import AuthStack from './src/navigation/AuthStack'
import VendorStack from './src/navigation/VendorStack'
import PatronStack from './src/navigation/PatronStack'

import { useAuth } from './src/hooks/useAuth'

export default function App() {
  const { userIsAuthenticated, isVendor } = useAuth()

  if (userIsAuthenticated && isVendor) {
    return <VendorStack />
  } else if (userIsAuthenticated && !isVendor) {
    return <PatronStack />
  } else {
    return <AuthStack />
  }
}
