import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { WEB_CLIENT_ID } from '@env'

console.log(WEB_CLIENT_ID)

interface AuthProps {
  children: ReactNode
}

interface AuthContextProps {
  userInfo: FirebaseAuthTypes.User | null
  userIsAuthenticated: Boolean
  signInAnonymously: () => void
}

export const AuthContext = createContext<AuthContextProps>(null)

export function AuthProvider({ children }: AuthProps) {
  const auth = useAuthProvider()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useAuthProvider() {
  const [userInfo, setUserInfo] = useState<FirebaseAuthTypes.User | null>(null)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<Boolean>(false)

  const onAuthStateChanged = (result: FirebaseAuthTypes.User | null) => {
    setUserInfo(result)
    setUserIsAuthenticated(!!result)
  }

  const signInAnonymously = async () => {
    try {
      await auth().signInAnonymously()
    } catch (e) {
      handleAuthErrors(e)
    }
  }

  const handleAuthErrors = (e) => {
    switch (e.code) {
      case 'auth/operation-not-allowed':
        console.log('Enable anonymous in your firebase console.')
        break
      default:
        console.error(e)
        break
    }
  }

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)

    // unsubscribe on unmount
    return authSubscriber
  }, [])

  return {
    userInfo,
    userIsAuthenticated,
    signInAnonymously,
  }
}
