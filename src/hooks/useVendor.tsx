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

  const addPopUp = (popUpInfo) => {
    const ref = firestore().collection('popUps')
    const docId = ref.doc().id
    const dateAdded = firestore.Timestamp.now()

    ref
      .doc(docId)
      .set({
        ...popUpInfo,
        dateAdded,
      })
      .catch((error) => console.log(error))
  }

  return {
    isVendorSetup,
    addPopUp,
  }
}
