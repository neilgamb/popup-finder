import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { FAB, useTheme } from 'react-native-paper'

import { ScreenHeader } from '../../components'

export default function VendorMenu() {
  const { presets } = useTheme()

  return (
    <SafeAreaView style={[presets.screenContainer, styles.screenContainer]}>
      <ScreenHeader />
      <View style={presets.screenContent}></View>
      <FAB
        style={styles.fab}
        icon='plus'
        onPress={() => console.log('Pressed')}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 48,
    right: 0,
    bottom: 0,
    transform: [{ scale: 1.2 }],
    backgroundColor: '#5d6c8c',
  },
})