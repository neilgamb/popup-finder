/* ES6 Syntax */

var SCREEN = `
import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { presets } from '../../style/theme'

export default function [screen]() {
  return (
    <SafeAreaView style={[presets.screenContainer, overrides.screenContainer]}>
      <View style={presets.screenContent}>
        <Text style={presets.title}>New Screen</Text>
      </View>
      <View style={presets.screenActions}>

      </View>
    </SafeAreaView>
  )
}

const overrides = StyleSheet.create({
  
})
`

module.exports = SCREEN
