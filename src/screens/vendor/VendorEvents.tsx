import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { presets } from '../../style/theme'

export default function VendorHome() {
  return (
    <SafeAreaView style={[presets.screenContainer, overrides.screenContainer]}>
      <View style={presets.screenContent}>
        <Text style={presets.title}>Events</Text>
      </View>
      <View style={presets.screenActions}>
        {/* <TouchableOpacity style={presets.button} onPress={signOut}>
          <Text style={presets.buttonText}>Sign out</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  )
}

const overrides = StyleSheet.create({})
