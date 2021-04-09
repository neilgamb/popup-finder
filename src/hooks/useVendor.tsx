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
  deletePopUp: (userUid: string, popUpUid: string) => void
  editPopUp: (popUpInfo: object) => void
  getVendorPopUps: () => void
  setIsVendorSetup: (isVendorSetup: boolean) => void
}

interface PopUp {
  dateAdded?: admin.firestore.Timestamp
  popUpUid: string
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
    const uid = popUpCollection.doc().id
    const dateAdded = firestore.Timestamp.now()

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(uid)
        .set({
          ...popUpInfo,
          dateAdded,
          userUid,
          popUpUid: uid,
        })
        .then(async () => {
          await addPopUpToVender(userUid, uid)
          populateVendorPopUps()
          resolve(uid)
        })
        .catch((error) => reject(error))
    })
  }

  const addPopUpToVender = (userUid: string, popUpUid: string) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(userUid)
        .collection('popUps')
        .doc(popUpUid)
        .set({ popUpUid })
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  const editPopUp = (popUpInfo: PopUp) => {
    const popUpCollection = firestore().collection('popUps')

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(popUpInfo.popUpUid)
        .set(popUpInfo)
        .then(async () => {
          populateVendorPopUps()
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const deletePopUp = (userUid: string, popUpUid: string) => {
    const popUpCollection = firestore().collection('popUps')

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(popUpUid)
        .delete()
        .then(async () => {
          await removePopUpFromVender(userUid, popUpUid)
          populateVendorPopUps()
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const removePopUpFromVender = (userUid: string, popUpUid: string) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(userUid)
        .collection('popUps')
        .doc(popUpUid)
        .delete()
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

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
    } else {
      setIsVendorSetup(false)
    }
  }

  useEffect(() => {
    populateVendorPopUps()
  }, [])

  return {
    isVendorSetup,
    activePopUp,
    addPopUp,
    editPopUp,
    deletePopUp,
  }
}
