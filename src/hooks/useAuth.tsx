import React, { useState, useEffect, useContext, createContext } from 'react'
import auth from '@react-native-firebase/auth'

export const AuthContext = createContext(false)

export function AuthProvider({ children }) {
  const auth = useAuthProvider()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useAuthProvider() {
  const [user, setUser] = useState(null)

  const onAuthStateChanged = (result) => {
    if (result) {
      console.log(result.uid)
    }
    setUser(result)
  }

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)

    // unsubscribe on unmount
    return authSubscriber
  }, [])

  return {
    user,
  }
}
