import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

interface AuthProps {
  children: ReactNode
}

export const AuthContext = createContext<FirebaseAuthTypes.User | null>(null)

export function AuthProvider({ children }: AuthProps) {
  const user = useAuthProvider()
  return (
    <AuthContext.Provider value={user.userInfo}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useAuthProvider() {
  const [userInfo, setUserInfo] = useState<FirebaseAuthTypes.User | null>(null)

  const onAuthStateChanged = (result: FirebaseAuthTypes.User | null) =>
    setUserInfo(result)

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)

    // unsubscribe on unmount
    return authSubscriber
  }, [])

  return {
    userInfo,
  }
}
