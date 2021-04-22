import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import firestore from '@react-native-firebase/firestore'
import * as admin from 'firebase-admin'

export interface PopUp {
  dateAdded?: admin.firestore.Timestamp
  popUpUid: string
  name: string
  location: string
  foodType: string
  description: string
  user: string
}

export interface MenuItem {
  dateAdded?: admin.firestore.Timestamp
  menuItemUid: string
  name: string
  description: string
  price: string
}

interface VendorProps {
  children: ReactNode
}

interface VendorContextProps {
  isVendorSetup: boolean
  activePopUp: PopUp
  menuItems: Array<MenuItem>
  addPopUp: (popUpInfo: object) => void
  deletePopUp: (popUpUid: string) => void
  editPopUp: (popUpInfo: object) => void
  addMenuItemToPopUp: (menuItemInfo: MenuItem) => void
  setActiveUserUid: (userUid: string) => void
  resetVendor: () => void
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
  const [activeUserUid, setActiveUserUid] = useState('')
  const [isVendorSetup, setIsVendorSetup] = useState<boolean>(true)
  const [vendorPopUps, setVendorPopUps] = useState<PopUp[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activePopUp, setActivePopUp] = useState<PopUp | null>(null)

  const addPopUp = (popUpInfo: PopUp) => {
    const popUpCollection = firestore().collection('popUps')
    const uid = popUpCollection.doc().id
    const dateAdded = firestore.Timestamp.now()

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(uid)
        .set({
          ...popUpInfo,
          dateAdded,
          userUid: activeUserUid,
          popUpUid: uid,
        })
        .then(async () => {
          await addPopUpToVendor(uid)
          resolve(uid)
        })
        .catch((error) => reject(error))
    })
  }

  const addPopUpToVendor = (popUpUid: string) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(activeUserUid)
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
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const deletePopUp = (popUpUid: string) => {
    const popUpCollection = firestore().collection('popUps')

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(popUpUid)
        .delete()
        .then(async () => {
          await removePopUpFromVendor(popUpUid)
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const removePopUpFromVendor = (popUpUid: string) => {
    const userCollection = firestore().collection('users')

    return new Promise((resolve, reject) => {
      userCollection
        .doc(activeUserUid)
        .collection('popUps')
        .doc(popUpUid)
        .delete()
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  const addMenuItemToPopUp = (values: MenuItem) => {
    const popUpCollection = firestore().collection('popUps')
    const uid = popUpCollection.doc().id

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(activePopUp?.popUpUid)
        .collection('menuItems')
        .doc(uid)
        .set({ ...values, menuItemUid: uid })
        .then(() => {
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const getVendorPopUps = async () => {
    const popUpCollection = firestore()
      .collection('popUps')
      .where('userUid', '==', activeUserUid)

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

  const getPopUps = () => {
    const unsubscribePopUps = firestore()
      .collection('popUps')
      .where('userUid', '==', activeUserUid)
      .onSnapshot((querySnapshot) => {
        let popUps = [] as PopUp[]
        querySnapshot.forEach((doc) => {
          popUps.push(doc.data())
        })
        setVendorPopUps(popUps)
        if (popUps.length) {
          setActivePopUp(popUps[0])
          setIsVendorSetup(true)
        } else {
          resetVendor()
        }
      })

    return unsubscribePopUps
  }

  const getMenuItems = () => {
    const unsubscribeMenuItems = firestore()
      .collection('popUps')
      .doc(activePopUp?.popUpUid)
      .collection('menuItems')
      .onSnapshot((querySnapshot) => {
        let menuItems = [] as MenuItem[]
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          menuItems.push(doc.data())
        })
        setMenuItems(menuItems)
      })

    return unsubscribeMenuItems
  }

  const resetVendor = () => {
    setActivePopUp(null)
    setIsVendorSetup(true)
    setActiveUserUid('')
  }

  useEffect(() => {
    const unsubscribePopUps = getPopUps()

    if (!activeUserUid) {
      console.log('unsubscribing from pop up updates...')
      unsubscribePopUps()
    }
  }, [activeUserUid])

  useEffect(() => {
    const unsubscribeMenuItems = getMenuItems()

    if (!activePopUp) {
      console.log('unsubscribing from menu item updates...')
      unsubscribeMenuItems()
    }
  }, [activePopUp])

  return {
    isVendorSetup,
    activePopUp,
    menuItems,
    addPopUp,
    editPopUp,
    deletePopUp,
    addMenuItemToPopUp,
    setActiveUserUid,
    resetVendor,
  }
}
