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
  isVendor: boolean | null
  isVendorInviteValid: boolean
  signingIn: string | null
  signInAnonymously: (isVendor: boolean) => void
  signInWithGoogle: (
    isVendor: boolean,
    setActiveUserUid?: (userUid: string) => void
  ) => void
  verifyVendorInvite: (email: String) => boolean
  setIsVendorInviteValid: (isVendorInviteValid: boolean) => void
  setSigningIn: (signingIn: string | null) => void
}

export const AuthContext =
  createContext<AuthContextProps | undefined>(undefined)

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
  const [signingIn, setSigningIn] = useState<string | null>(null)

  const onAuthStateChanged = (result: FirebaseAuthTypes.User | null) => {
    setUserInfo(result)
    setUserIsAuthenticated(!!result)
    if (!result) setIsVendor(false)
  }

  const signInAnonymously = async (isVendor: boolean) => {
    try {
      setSigningIn('anon')
      await auth().signInAnonymously()
      setIsVendor(isVendor)
    } catch (e) {
      handleAuthErrors(e)
    } finally {
      setSigningIn(null)
    }
  }

  const signInWithGoogle = async (
    isVendor: boolean,
    setActiveUserUid?: (userUid: string) => void
  ) => {
    try {
      setSigningIn('goog')
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const { user } = await auth().signInWithCredential(googleCredential)
      setActiveUserUid && setActiveUserUid(user.uid)
      syncUserWithFirestoreUsers(user, isVendor)
      setIsVendor(isVendor)
    } catch (e) {
      handleAuthErrors(e)
    } finally {
      setSigningIn(null)
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
          if (querySnapshot.size === 0) {
            reject('You are not yet invited')
          }
          querySnapshot.forEach((doc) => {
            if (email.toLowerCase() === doc.id) {
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

  const handleAuthErrors = (e: FirebaseAuthTypes.NativeFirebaseAuthError) => {
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
    signingIn,
    signInAnonymously,
    signInWithGoogle,
    verifyVendorInvite,
    setIsVendorInviteValid,
    setSigningIn,
  }
}
