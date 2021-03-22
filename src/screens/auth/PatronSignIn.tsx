import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '../../hooks/useAuth'

export default function PatronSignIn() {
  const { signInAnonymously, signInWithGoogle } = useAuth()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={signInAnonymously}>
        <Text style={styles.buttonText}>Login Anonymously</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => signInWithGoogle(true)}
      >
        <Text style={styles.buttonText}>Login as Patron with Google</Text>
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
  button: {
    flexDirection: 'row',
    borderRadius: 30,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    marginRight: 5,
  },
})
