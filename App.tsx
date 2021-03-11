import React from 'react'

import AuthStack from './src/navigation/AuthStack'
import VendorStack from './src/navigation/VendorStack'

import { useAuth } from './src/hooks/useAuth'

export default function App() {
  const { userIsAuthenticated } = useAuth()
  return userIsAuthenticated ? <VendorStack /> : <AuthStack />
}
