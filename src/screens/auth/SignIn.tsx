import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '../../hooks/useAuth'

export default function SignIn() {
  const { signInAnonymously } = useAuth()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={signInAnonymously}>
        <Text style={styles.buttonText}>Login Anonymously</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    marginRight: 5,
  },
})
