import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import firestore from '@react-native-firebase/firestore'
import * as admin from 'firebase-admin'

import { MenuItem } from './index'

interface EventsProps {
  children: ReactNode
}

interface EventsContextProps {}

export interface Event {
  dateAdded?: admin.firestore.Timestamp
  addedBy: string
  eventUid: string
  popUpUid: string
  location: string
  locationData: google.maps.places.PlaceResult
  eventDate: admin.firestore.Timestamp | Date | undefined
  menu: Array<MenuItem>
}

export const EventsContext = createContext<EventsContextProps | null>(null)

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
