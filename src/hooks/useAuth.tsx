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
import AsyncStorage from '@react-native-async-storage/async-storage'

GoogleSignin.configure({
  webClientId: '',
})

interface AuthProps {
  children: ReactNode
}

interface AuthContextProps {
  userInfo: FirebaseAuthTypes.User | null
  userIsAuthenticated: boolean
  isVendor: boolean
  isVendorInviteValid: boolean
  isLoading: boolean
  signInAnonymously: () => void
  signInWithGoogle: (isVender: boolean) => void
  verifyVendorInvite: (email: String) => boolean
  setIsVendorInviteValid: (isVendorInviteValid: boolean) => void
  setIsLoading: (isLoading: boolean) => void
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
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(false)
  const [isVendor, setIsVendor] = useState<boolean | null>(null)
  const [isVendorInviteValid, setIsVendorInviteValid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onAuthStateChanged = (result: FirebaseAuthTypes.User | null) => {
    setUserInfo(result)
    setUserIsAuthenticated(!!result)
  }

  const signInAnonymously = async () => {
    try {
      setIsLoading(true)
      await auth().signInAnonymously()
    } catch (e) {
      handleAuthErrors(e)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async (isVendor: boolean) => {
    try {
      setIsLoading(true)
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const { user } = await auth().signInWithCredential(googleCredential)
      syncUserWithFirestoreUsers(user, isVendor)
      setIsVendor(isVendor)
    } catch (e) {
      handleAuthErrors(e)
    } finally {
      setIsLoading(false)
    }
  }

  const syncUserWithFirestoreUsers = async (
    user: FirebaseAuthTypes.User,
    isVendor: boolean
  ) => {
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
    } catch (error) {
      console.log(error)
    }
  }

  const verifyVendorInvite = (email: String) => {
    return new Promise((resolve, reject) => {
      const invitedVendors = firestore().collection('invitedVendors')
      invitedVendors
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const result = doc.data()
            if (email.toLowerCase() === result.email) {
              resolve(true)
            } else {
              reject('You are not yet invited')
            }
          })
        })
        .catch((error) => {
          console.log('Error getting documents: ', error)
          reject('Something went wrong')
        })
    })
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
    const checkIsVendorInviteVerified = async () => {
      const isVendorInviteValid = await AsyncStorage.getItem(
        '@isVendorInviteValid'
      )
      setIsVendorInviteValid(!!isVendorInviteValid)
      // setIsVendorInviteValid(false)
    }
    checkIsVendorInviteVerified()
    // unsubscribe on unmount
    return authSubscriber
  }, [])

  return {
    userInfo,
    userIsAuthenticated,
    isVendor,
    isVendorInviteValid,
    isLoading,
    signInAnonymously,
    signInWithGoogle,
    verifyVendorInvite,
    setIsVendorInviteValid,
    setIsLoading,
  }
}
