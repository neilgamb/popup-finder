import React, { useState } from 'react'
import { View, SafeAreaView } from 'react-native'
import { TextInput, Title, withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components'

const VendorSignIn = ({ theme }: any) => {
  const { goBack } = useNavigation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const {
    isVendorInviteValid,
    setIsVendorInviteValid,
    signInWithGoogle,
    verifyVendorInvite,
  } = useAuth()

  const handleVerifyVendorInvite = async (email: String) => {
    try {
      const vendorInviteVerified = verifyVendorInvite(email)
      if (vendorInviteVerified) {
        setIsVendorInviteValid(true)
        await AsyncStorage.setItem('@isVendorInviteValid', JSON.stringify(true))
      }
    } catch (error) {
      setError(error)
    }
  }

  const { presets } = theme

  return (
    <SafeAreaView style={presets.screenContainer}>
      <View style={{ ...presets.screenContent, paddingTop: 200 }}>
        {/* {!!error && <Text style={styles.error}>{error}</Text>} */}
        {!isVendorInviteValid && (
          <>
            <Title>Enter Email from Invite</Title>
            <TextInput
              mode='outlined'
              label='Email'
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </>
        )}
      </View>
      <View style={presets.screenActions}>
        {!isVendorInviteValid ? (
          <>
            <Button
              dark
              mode='contained'
              onPress={() => handleVerifyVendorInvite(email)}
            >
              Submit
            </Button>
            <Button onPress={goBack}>Back</Button>
          </>
        ) : (
          <Button mode='contained' onPress={() => signInWithGoogle(true)}>
            Login
          </Button>
        )}
      </View>
    </SafeAreaView>
  )
}

export default withTheme(VendorSignIn)
