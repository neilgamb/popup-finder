import React, { useState } from 'react'
import { View, SafeAreaView } from 'react-native'
import { withTheme, HelperText } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAuth, useVendor } from '../../hooks'
import { Button, TextInput, Text, DismissKeyboard } from '../../components'

const VendorSignIn = ({ theme }: any) => {
  const { goBack } = useNavigation()
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const {
    isVendorInviteValid,
    signingIn,
    setIsVendorInviteValid,
    signInWithGoogle,
    verifyVendorInvite,
  } = useAuth()

  const { setActiveUserUid } = useVendor()

  const handleEmailSubmit = async (email: String) => {
    try {
      setIsVerifying(true)
      validateEmail(email)
      const vendorInviteVerified = await verifyVendorInvite(email)
      if (vendorInviteVerified) {
        setIsVendorInviteValid(true)
        await AsyncStorage.setItem('@isVendorInviteValid', JSON.stringify(true))
      }
    } catch (error) {
      setError(error)
    } finally {
      setIsVerifying(false)
    }
  }

  const validateEmail = (email: String) => {
    if (!email.includes('@')) {
      throw 'Invalid Email'
    }
  }

  const { presets, spacing } = theme

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
        <View style={{ ...presets.screenContent, paddingTop: 200 }}>
          {!isVendorInviteValid && (
            <>
              <Text>Enter Email from Invite</Text>
              <TextInput
                label='Email'
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <HelperText
                style={{ marginTop: spacing.xs, fontSize: 14 }}
                type='error'
                visible={!!error}
              >
                {error}
              </HelperText>
            </>
          )}
        </View>
        <View style={presets.screenActions}>
          {!isVendorInviteValid ? (
            <>
              <Button
                loading={isVerifying}
                onPress={() => handleEmailSubmit(email)}
              >
                Submit
              </Button>
              <Button mode='text' onPress={goBack}>
                Back
              </Button>
            </>
          ) : (
            <>
              <Button
                loading={signingIn}
                onPress={() => signInWithGoogle(true, setActiveUserUid)}
              >
                Login
              </Button>
              <Button mode='text' onPress={goBack}>
                Back
              </Button>
            </>
          )}
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  )
}

export default withTheme(VendorSignIn)
