import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '../../hooks/useAuth'

export default function VendorSignIn() {
  const { signInWithGoogle } = useAuth()
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => signInWithGoogle(true)}
      >
        <Text style={styles.buttonText}>Login as Vendor with Google</Text>
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
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
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
