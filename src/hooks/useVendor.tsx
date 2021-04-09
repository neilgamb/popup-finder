import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import firestore from '@react-native-firebase/firestore'
import * as admin from 'firebase-admin'

interface VendorProps {
  children: ReactNode
}

interface VendorContextProps {
  isVendorSetup: boolean
  activePopUp: PopUp
  addPopUp: (popUpInfo: object, userUid: string) => void
  addPopUpToVender: (
    userUid: string,
    popUpUid: string,
    popUpInfo: object
  ) => void
  getVendorPopUps: () => void
  setIsVendorSetup: (isVendorSetup: boolean) => void
}

interface PopUp {
  dateAdded?: admin.firestore.Timestamp
  uid: string
  name: string
  location: string
  foodType: string
  description: string
  user: string
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
  const [vendorPopUps, setVendorPopUps] = useState<PopUp[]>([])
  const [activePopUp, setActivePopUp] = useState<PopUp | null>(null)

  const addPopUp = (popUpInfo: PopUp, userUid: string) => {
    const popUpCollection = firestore().collection('popUps')
    const popUpUid = popUpCollection.doc().id
    const dateAdded = firestore.Timestamp.now()

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(popUpUid)
        .set({
          dateAdded,
          popUpUid,
          userUid,
          ...popUpInfo,
        })
        .then(() => resolve(popUpUid))
        .catch((error) => reject(error))
    })
  }

  const addPopUpToVender = (
    userUid: string,
    popUpUid: string,
    popUpInfo: PopUp
  ) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(userUid)
        .collection('popUps')
        .doc(popUpUid)
        .set({ ...popUpInfo, popUpUid })
        .then(() => {
          populateVendorPopUps()
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const editPopUp = (popUpInfo: PopUp) => {}

  const deletePopUp = (popUpUid) => {}

  const getVendorPopUps = async () => {
    const popUpCollection = firestore().collection('popUps')
    let popUps = [] as PopUp[]

    return new Promise<PopUp[]>((resolve, reject) => {
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
    if (popUps.length) {
      setActivePopUp(popUps[0])
      setIsVendorSetup(true)
    }
  }

  useEffect(() => {
    populateVendorPopUps()
  }, [])

  return {
    isVendorSetup,
    activePopUp,
    setIsVendorSetup,
    addPopUp,
    addPopUpToVender,
  }
}
