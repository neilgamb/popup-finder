import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import firestore from '@react-native-firebase/firestore'

interface VendorProps {
  children: ReactNode
}

interface VendorContextProps {
  addPopUp: (popUpInfo: object) => void
}

export const VendorContext = createContext<VendorContextProps>(null)

export function VendorProvider({ children }: VendorProps) {
  const Vendor = useVendorProvider()
  return (
    <VendorContext.Provider value={Vendor}>{children}</VendorContext.Provider>
  )
}

export const useVendor = () => {
  return useContext(VendorContext)
}

function useVendorProvider() {
  const [isVendorSetup, setIsVendorSetup] = useState<boolean>(false)

  const addPopUp = (popUpInfo, userUid) => {
    const popUpCollection = firestore().collection('popUps')
    const docId = popUpCollection.doc().id
    const dateAdded = firestore.Timestamp.now()

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(docId)
        .set({
          ...popUpInfo,
          dateAdded,
          user: userUid,
        })
        .then(() => resolve(docId))
        .catch((error) => reject(error))
    })
  }

  const addPopUpToVender = (userUid, popUpId, popUpInfo) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(userUid)
        .collection('popUps')
        .add({ uid: popUpId, name: popUpInfo.name })
        // .set({ uid: popUpInfo.uid, name: popUpInfo.name })
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  return {
    isVendorSetup,
    setIsVendorSetup,
    addPopUp,
    addPopUpToVender,
  }
}
