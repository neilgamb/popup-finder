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

export interface Event {
  dateAdded?: admin.firestore.Timestamp
  eventUid: string
  popUp: string
  popUpUid: string
  userUid: string
  location: string
  locationData: google.maps.places.PlaceResult
  eventDate: admin.firestore.Timestamp
  menu: Array<MenuItem>
}

interface EventsProps {
  children: ReactNode
}

interface EventsContextProps {
  addEvent: (eventInfo: object) => Promise<boolean>
  editEvent: (eventInfo: object) => Promise<boolean>
  getEvents: (popUid?: string) => () => {}
  events: Array<Event>
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
  const [events, setEvents] = useState<Event[]>([])

  const addEvent = (eventInfo: Event) => {
    const eventCollection = firestore().collection('events')
    const uid = eventCollection.doc().id
    const dateAdded = firestore.Timestamp.now()

    return new Promise(async (resolve, reject) => {
      eventCollection
        .doc(uid)
        .set({
          ...eventInfo,
          dateAdded,
          eventUid: uid,
        })
        .then(async () => {
          resolve(uid)
        })
        .catch((error) => reject(error))
    })
  }

  const editEvent = (eventInfo: Event) => {
    const eventCollection = firestore().collection('events')

    return new Promise(async (resolve, reject) => {
      eventCollection
        .doc(eventInfo.eventUid)
        .set(eventInfo)
        .then(async () => {
          resolve(true)
        })
        .catch((error) => reject(error))
    })
  }

  const getEvents = (popUpUid: string) => {
    console.log('subscribing to events')

    let query = firestore().collection('events')

    if (!!popUpUid) {
      query = query.where('popUpUid', '==', popUpUid)
    }

    const unsubscribeEvents = query.onSnapshot((querySnapshot) => {
      let events = [] as Event[]
      querySnapshot.forEach((doc) => {
        events.push(doc.data())
      })
      setEvents(events)
    })

    return unsubscribeEvents
  }

  return { addEvent, editEvent, getEvents, events }
}
