import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-community/google-signin'
import firestore from '@react-native-firebase/firestore'

GoogleSignin.configure({
  webClientId: '',
})

interface AuthProps {
  children: ReactNode
}

interface AuthContextProps {
  userInfo: FirebaseAuthTypes.User | null
  userIsAuthenticated: Boolean
  signInAnonymously: () => void
  signInWithGoogle: (isVender: Boolean) => void
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
  const [isVendor, setIsVendor] = useState<Boolean | null>(null)

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

  const signInWithGoogle = async (isVendor: Boolean) => {
    try {
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const userCredential = await auth().signInWithCredential(googleCredential)
      syncUserWithFirestoreUsers(userCredential.user, isVendor)
      setIsVendor(isVendor)
    } catch (e) {
      handleAuthErrors(e)
    }
  }

  const syncUserWithFirestoreUsers = async (user, isVendor) => {
    const userDoc = firestore().collection('users').doc(user.uid)
    try {
      // check if user exists in firestore
      const doc = await userDoc.get()
      if (doc.exists) {
        console.log('User exists in firestore: ', doc.data())
      } else {
        // check if user does not exist, create new doc
        await userDoc.set({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          isVendor,
        })
        console.log('User added to firestore')
      }
    } catch (error) {}
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
    isVendor,
    signInAnonymously,
    signInWithGoogle,
  }
}
