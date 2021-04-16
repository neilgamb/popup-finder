
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'

interface EventsProps {
  children: ReactNode
}

interface EventsContextProps {

}

export const EventsContext = createContext<EventsContextProps>(null)

export function EventsProvider({ children }: EventsProps) {
  const events = useEventsProvider()
  return <EventsContext.Provider value={events}>{children}</EventsContext.Provider>
}

export const useEvents = () => {
  return useContext(EventsContext)
}

function useEventsProvider() {
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
