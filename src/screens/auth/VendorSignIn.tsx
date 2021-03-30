import React, { useState } from 'react'
import { View, SafeAreaView } from 'react-native'
import { Title, withTheme, HelperText } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAuth } from '../../hooks/useAuth'
import { Button, TextInput, DismissKeyboard } from '../../components'

const VendorSignIn = ({ theme }: any) => {
  const { goBack } = useNavigation()
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const {
    isVendorInviteValid,
    isLoading,
    setIsVendorInviteValid,
    signInWithGoogle,
    verifyVendorInvite,
    setIsLoading,
  } = useAuth()

  const handleEmailSubmit = async (email: String) => {
    try {
      setIsLoading(true)
      validateEmail(email)
      const vendorInviteVerified = await verifyVendorInvite(email)
      if (vendorInviteVerified) {
        setIsVendorInviteValid(true)
        await AsyncStorage.setItem('@isVendorInviteValid', JSON.stringify(true))
      }
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
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
              <Title style={{ marginLeft: spacing.xs }}>
                Enter Email from Invite
              </Title>
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
                loading={isLoading}
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
                loading={isLoading}
                onPress={() => signInWithGoogle(true)}
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
