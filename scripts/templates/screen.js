/* ES6 Syntax */

var SCREEN = `
import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'

import { ScreenHeader } from '../../components'

export default function ScreenName() {
  const { presets } = useTheme()

  return (
    <SafeAreaView style={[presets.screenContainer, styles.screenContainer]}>
      <ScreenHeader />
      <View style={presets.screenContent}></View>
      <View style={presets.screenActions}></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
`

module.exports = SCREEN
