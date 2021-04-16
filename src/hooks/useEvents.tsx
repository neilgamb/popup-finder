import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import firestore from '@react-native-firebase/firestore'
import * as admin from 'firebase-admin'

interface EventsProps {
  children: ReactNode
}

interface EventsContextProps {}

interface MenuItem {
  menuItemUid: string
  name: string
  description: string
  price: string
}

interface Event {
  dateAdded?: admin.firestore.Timestamp
  addedBy: string
  eventUid: string
  popUpUid: string
  popUpName: string
  location: string
  popUpDate: admin.firestore.Timestamp
  menu: Array<MenuItem>
}

export const EventsContext = createContext<EventsContextProps>(null)

export function EventsProvider({ children }: EventsProps) {
  const events = useEventsProvider()
  return (
    <EventsContext.Provider value={events}>{children}</EventsContext.Provider>
  )
}

export const useEvents = () => {
  return useContext(EventsContext)
}

function useEventsProvider() {
  return {}
}
