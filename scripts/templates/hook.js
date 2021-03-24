/* ES6 Syntax */

var HOOK = `
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'

interface [hook]Props {
  children: ReactNode
}

interface [hook]ContextProps {

}

export const [hook]Context = createContext<[hook]ContextProps>(null)

export function [hook]Provider({ children }: [hook]Props) {
  const [hookLower] = use[hook]Provider()
  return <[hook]Context.Provider value={[hookLower]}>{children}</[hook]Context.Provider>
}

export const use[hook] = () => {
  return useContext([hook]Context)
}

function use[hook]Provider() {
  const [isMounted, setIsMounted] = useState<boolean>(false)  

  useEffect(() => {
    setIsMounted(true)
    
    return () => {
      setIsMounted(true)
    }
  }, [])

  return {
    
  }
}
`

module.exports = HOOK
