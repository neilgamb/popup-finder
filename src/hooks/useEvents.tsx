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

interface EventsContextProps {
  addEvent: (eventInfo: object) => Promise<boolean>
  getEvents: (popUid?: string) => () => {}
}

export interface Event {
  dateAdded?: admin.firestore.Timestamp
  eventUid: string
  popUpUid: string
  userUid: string
  location: string
  locationData: google.maps.places.PlaceResult
  eventDate: admin.firestore.Timestamp | Date | undefined
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

  const getEvents = (popUid: string) => {
    popUid = popUid || ''
    console.log('subscribing to user events')
    const unsubscribeEvents = firestore()
      .collection('events')
      // .where('popUpUid', '==', popUid)
      .onSnapshot((querySnapshot) => {
        // let popUps = [] as PopUp[]
        querySnapshot.forEach((doc) => {
          // popUps.push(doc.data())
          console.log(doc.data())
        })
        // setVendorPopUps(popUps)
        // if (popUps.length) {
        //   setActivePopUp(popUps[0])
        //   setIsVendorSetup(true)
        // } else {
        //   setIsVendorSetup(false)
        // }
      })

    return unsubscribeEvents
  }

  return { addEvent, getEvents }
}
