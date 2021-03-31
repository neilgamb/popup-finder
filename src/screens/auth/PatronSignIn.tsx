import React from 'react'
import { View, SafeAreaView } from 'react-native'
import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useAuth } from '../../hooks/useAuth'
import { Button, DismissKeyboard } from '../../components'

const VendorSignIn = ({ theme }: any) => {
  const { goBack } = useNavigation()
  const { isLoading, signInAnonymously, signInWithGoogle } = useAuth()

  const { presets } = theme

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
        <View style={{ ...presets.screenContent, paddingTop: 200 }}></View>
        <View style={presets.screenActions}>
          <Button loading={isLoading} onPress={() => signInAnonymously(false)}>
            Sign In Anonymously
          </Button>
          <Button loading={isLoading} onPress={() => signInWithGoogle(false)}>
            Sign In With Google
          </Button>
          <Button mode='text' onPress={goBack}>
            Back
          </Button>
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  )
}

export default withTheme(VendorSignIn)
