import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useAuth } from '../../hooks/useAuth'

export default function VendorSignIn() {
  const [email, setEmail] = useState('')
  const [isVerified, setIsVerified] = useState<Boolean>(false)
  const [error, setError] = useState(null)
  const { signInWithGoogle, verifyVendorInvite } = useAuth()

  const handleVerifyVendorInvite = async (email: String) => {
    try {
      const vendorInviteVerified = await verifyVendorInvite(email)
      if (vendorInviteVerified) {
        setIsVerified(true)
      }
    } catch (error) {
      setError(error)
    }
  }

  return (
    <View style={styles.container}>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!isVerified ? (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder='Enter email from invite'
            placeholderTextColor='#999'
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleVerifyVendorInvite(email)}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => signInWithGoogle(true)}
        >
          <Text style={styles.buttonText}>Login as Vendor with Google</Text>
        </TouchableOpacity>
      )}
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
  input: {
    height: 60,
    borderWidth: 1,
    width: '100%',
    borderRadius: 30,
    fontSize: 24,
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
  error: {
    fontSize: 24,
    color: 'red',
    marginBottom: 16,
  },
})
