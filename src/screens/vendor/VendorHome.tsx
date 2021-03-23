import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import auth from '@react-native-firebase/auth'

import { useAuth } from '../../hooks/useAuth'
import { presets } from '../../style/theme'

export default function VendorHome() {
  let { userInfo } = useAuth()

  const signOut = async () => {
    try {
      await auth().signOut()
    } catch (e) {
      console.error(e)
    }
  }

  const displayName = userInfo?.displayName?.split(' ')[0]

  return (
    <SafeAreaView style={presets.screenContainer}>
      <View style={presets.screenContent}>
        <View style={styles.header}>
          <Text style={[presets.title, overrides.title]}>
            Welcome {displayName}!
          </Text>
          <Image
            source={{ uri: userInfo?.photoURL }}
            height={35}
            width={35}
            style={{ height: 35, width: 35 }}
          />
        </View>
      </View>
      {/* <View style={presets.screenActions}>
        <TouchableOpacity style={presets.button} onPress={signOut}>
          <Text style={presets.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  )
}

const overrides = StyleSheet.create({
  title: {
    marginTop: 0,
  },
})

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
})
