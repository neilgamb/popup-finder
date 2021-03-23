/* ES6 Syntax */

var SCREEN = `
import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function [comp]() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={()=>console.log('hi from new screen')}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
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
})
`

module.exports = SCREEN
