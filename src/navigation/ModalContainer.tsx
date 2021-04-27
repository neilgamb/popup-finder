import React from 'react'
import { View, StyleSheet } from 'react-native'
import { theme } from '../style/theme'

const ModalContainer = ({ children }) => (
  <View style={styles.container}>
    <View style={styles.containerInner}>{children}</View>
  </View>
)

export default ModalContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  containerInner: {
    height: '85%',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderTopRightRadius: theme.roundness * 1.5,
    borderTopLeftRadius: theme.roundness * 1.5,
  },
})
