import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'

interface VendorProps {
  children: ReactNode
}

interface VendorContextProps {}

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

  useEffect(() => {
    // setIsMounted(true)

    return () => {
      // setIsMounted(true)
    }
  }, [])

  return {
    isVendorSetup,
  }
}
