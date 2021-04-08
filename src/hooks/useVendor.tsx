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
  isVendorSetup: boolean
  addPopUp: (popUpInfo: object, userUid: string) => void
  addPopUpToVender: (
    userUid: string,
    popUpId: string,
    popUpInfo: object
  ) => void
  getVendorPopUps: () => void
}

interface PopUp {}

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
  const [vendorPopUps, setVendorPopUps] = useState<PopUp[]>([])

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

  const addPopUpToVender = (
    userUid: string,
    popUpId: string,
    popUpInfo: object
  ) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(userUid)
        .collection('popUps')
        .add({ uid: popUpId, name: popUpInfo.name })
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  const getVendorPopUps = async () => {
    const popUpCollection = firestore().collection('popUps')
    let popUps = [] as PopUp[]

    return new Promise((resolve, reject) => {
      popUpCollection
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            popUps.push(doc.data())
          })
          return popUps
        })
        .then((popUps) => {
          resolve(popUps)
        })
        .catch((error) => reject(error))
    })
  }

  const populateVendorPopUps = async () => {
    const popUps = await getVendorPopUps()
    setVendorPopUps(popUps)
    if (popUps.length) setIsVendorSetup(true)
  }

  useEffect(() => {
    populateVendorPopUps()
  }, [])

  return {
    isVendorSetup,
    setIsVendorSetup,
    addPopUp,
    addPopUpToVender,
  }
}
