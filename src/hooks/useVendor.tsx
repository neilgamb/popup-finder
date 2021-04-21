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
  price: Number
}

interface VendorProps {
  children: ReactNode
}

interface VendorContextProps {
  isVendorSetup: boolean
  activePopUp: PopUp
  menuItems: Array<MenuItem>
  setActiveUserUid: (userUid: string) => void
  setIsVendorSetup: (isVendorSetup: boolean) => void
  addPopUp: (popUpInfo: object) => void
  deletePopUp: (popUpUid: string) => void
  editPopUp: (popUpInfo: object) => void
  addMenuItemToPopUp: (menuItemInfo: MenuItem) => void
  populateVendorPopUps: () => void
  populateMenuItems: () => void
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
          populateVendorPopUps()
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
          populateVendorPopUps()
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
          populateVendorPopUps()
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

    return new Promise((resolve, reject) => {
      popUpCollection
        .doc(activePopUp?.popUpUid)
        .collection('menuItems')
        .add({ ...values })
        .then(() => {
          resolve(true)
          populateMenuItems()
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

  const getMenuItems = async () => {
    const popUpCollection = firestore()
      .collection('popUps')
      .where('userUid', '==', activeUserUid)

    let menuItems = [] as MenuItem[]

    return new Promise<MenuItem[]>((resolve, reject) => {
      popUpCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref
            .collection('menuItems')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                menuItems.push(doc.data())
              })
              return menuItems
            })
            .then((menuItems) => {
              resolve(menuItems)
            })
            .catch((error) => reject(error))
        })
      })
    })
  }

  const populateVendorPopUps = async () => {
    const popUps = await getVendorPopUps()
    setVendorPopUps(popUps)
    if (popUps.length) {
      setActivePopUp(popUps[0])
      setIsVendorSetup(true)
    } else {
      setActivePopUp(null)
      setIsVendorSetup(false)
    }
  }

  const populateMenuItems = async () => {
    try {
      const menuItems = await getMenuItems()
      setMenuItems(menuItems)
      console.log(menuItems)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(activeUserUid)
  }, [activeUserUid])

  return {
    isVendorSetup,
    activePopUp,
    menuItems,
    setActiveUserUid,
    setIsVendorSetup,
    addPopUp,
    editPopUp,
    deletePopUp,
    addMenuItemToPopUp,
    populateVendorPopUps,
    populateMenuItems,
  }
}
