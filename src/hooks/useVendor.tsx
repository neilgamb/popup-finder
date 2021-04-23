import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import * as admin from 'firebase-admin'

export interface PopUp {
  dateAdded?: admin.firestore.Timestamp
  popUpUid: string
  name: string
  location: string
  foodType: string
  description: string
  user: string
  logoImageUrl: string
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
  addPopUp: (popUpInfo: object, logoImageUri: string) => Promise<boolean>
  editPopUp: (popUpInfo: object, logoImageUri: string) => Promise<boolean>
  deletePopUp: (popUpUid: string) => Promise<boolean>
  addMenuItem: (menuItemInfo: MenuItem) => Promise<boolean>
  editMenuItem: (menuItem: MenuItem) => Promise<boolean>
  deleteMenuItem: (menuItemUid: string) => Promise<boolean>
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

  const addPopUp = (popUpInfo: PopUp, logoImageUri: string) => {
    const popUpCollection = firestore().collection('popUps')
    const uid = popUpCollection.doc().id
    const dateAdded = firestore.Timestamp.now()

    return new Promise(async (resolve, reject) => {
      const logoImageUrl = await uploadLogoImage(logoImageUri, uid)
      popUpCollection
        .doc(uid)
        .set({
          ...popUpInfo,
          dateAdded,
          logoImageUrl,
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

  const uploadLogoImage = async (logoImageUri: string, popUpUid: string) => {
    return new Promise<string>(async (resolve, reject) => {
      const response = await fetch(logoImageUri)
      const blob = await response.blob()
      const reference = storage().ref(`popUpLogos/${popUpUid}.png`)

      reference
        .put(blob)
        .then(() => {
          console.log('upload success')
          reference.getDownloadURL().then((url) => {
            resolve(url)
          })
        })
        .catch((e) => reject(e))
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

  const editPopUp = (popUpInfo: PopUp, logoImageUri: string) => {
    const popUpCollection = firestore().collection('popUps')

    return new Promise(async (resolve, reject) => {
      const logoImageUrl = await uploadLogoImage(
        logoImageUri,
        popUpInfo.popUpUid
      )

      popUpCollection
        .doc(popUpInfo.popUpUid)
        .set({ ...popUpInfo, logoImageUrl })
        .then(() => resolve(true))
        .catch((error) => reject(error))
    })
  }

  const deletePopUp = (popUpUid: string) => {
    const popUpCollection = firestore().collection('popUps')

    return new Promise(async (resolve, reject) => {
      // TODO — when reinstating delete popup, need to make sure
      // TODO — we delete the logo image from storage
      // await storage().ref(`popUpLogos/${popUpUid}.png`).delete()

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
          setIsVendorSetup(false)
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
    setActiveUserUid('')
    setIsVendorSetup(true)
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
