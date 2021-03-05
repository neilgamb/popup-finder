import React, { useState, useEffect, createContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { SignIn } from './src/screens'
import auth from '@react-native-firebase/auth'

console.log(auth)

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <SignIn />
    </NavigationContainer>
  )
}
