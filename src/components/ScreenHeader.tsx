import React, { useState } from 'react'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { Menu, Provider, Title } from 'react-native-paper'
import auth from '@react-native-firebase/auth'

import { useAuth } from '../hooks/useAuth'
import { theme } from '../style/theme'

type ScreenHeaderProps = {
  // title: string
}

const ScreenHeader = () => {
  let { userInfo } = useAuth()
  // const displayName = userInfo?.displayName?.split(' ')[0]

  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  )

  const [visible, setVisible] = useState(false)

  const openMenu = () => setVisible(true)

  const closeMenu = () => setVisible(false)

  const signOut = async () => {
    try {
      await auth().signOut()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Title style={styles.title}>{routeName}</Title>
        <Menu
          visible={visible}
          theme={{ dark: false }}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={styles.avatarContainer} onPress={openMenu}>
              <Image
                source={{ uri: userInfo?.photoURL }}
                height={35}
                width={35}
                style={{ height: 35, width: 35 }}
              />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={signOut} title='Sign Out' />
        </Menu>
      </View>
    </Provider>
  )
}

export default ScreenHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  title: {
    marginRight: theme.spacing.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
})
