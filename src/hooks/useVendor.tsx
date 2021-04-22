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
  setActiveUserUid: (userUid: string) => void
  resetVendor: () => void
  addPopUp: (popUpInfo: object) => Promise<boolean>
  deletePopUp: (popUpUid: string) => Promise<boolean>
  editPopUp: (popUpInfo: object) => Promise<boolean>
  addMenuItem: (menuItemInfo: MenuItem) => Promise<boolean>
  deleteMenuItem: (menuItemUid: string) => Promise<boolean>
  editMenuItem: (menuItem: MenuItem) => Promise<boolean>
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
        .then(() => resolve(true))
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

  const addMenuItem = (values: MenuItem) => {
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

  const deleteMenuItem = (menuItemUid: string) => {
    const menuItemCollection = firestore()
      .collection('popUps')
      .doc(activePopUp?.popUpUid)
      .collection('menuItems')

    return new Promise((resolve, reject) => {
      menuItemCollection
        .doc(menuItemUid)
        .delete()
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  const editMenuItem = (menuItem: MenuItem) => {
    const menuItemCollection = firestore()
      .collection('popUps')
      .doc(activePopUp?.popUpUid)
      .collection('menuItems')

    return new Promise((resolve, reject) => {
      menuItemCollection
        .doc(menuItem.menuItemUid)
        .set(menuItem)
        .then(() => resolve(true))
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
          menuItems.push(doc.data())
        })
        setTimeout(() => {
          setMenuItems(menuItems)
        }, 500)
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
    setActiveUserUid,
    resetVendor,
    addPopUp,
    editPopUp,
    deletePopUp,
    addMenuItem,
    deleteMenuItem,
    editMenuItem,
  }
}
