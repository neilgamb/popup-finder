import React from 'react'
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { withTheme } from 'react-native-paper'

import { Text } from '../../components'

const Landing = () => {
  const { navigate } = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('PatronSignIn')}
        >
          <Text h1>Find a Pop Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('VendorSignIn')}
        >
          <Text h1>List a Pop Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default withTheme(Landing)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 30,
    width: '100%',
    height: '46%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    marginRight: 5,
  },
})
