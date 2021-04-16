import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigationState, useNavigation } from '@react-navigation/native'
import { Avatar, Menu, Title } from 'react-native-paper'
import auth from '@react-native-firebase/auth'

import { useAuth } from '../hooks/useAuth'
import { theme } from '../style/theme'

type ScreenHeaderProps = {
  // title: string
}

const ScreenHeader = () => {
  const { navigate } = useNavigation()
  const { userInfo, isVendor } = useAuth()

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
    <View style={styles.container}>
      <Title style={styles.title}>{routeName}</Title>
      <Menu
        visible={visible}
        theme={{ dark: false }}
        onDismiss={closeMenu}
        contentStyle={styles.menuContainer}
        anchor={
          <TouchableOpacity style={styles.avatarContainer} onPress={openMenu}>
            {userInfo?.isAnonymous ? (
              <Avatar.Icon
                icon='menu'
                style={{ backgroundColor: '#f0f0f0' }}
                size={60}
              />
            ) : (
              <Avatar.Image
                style={{ backgroundColor: '#f0f0f0' }}
                size={40}
                source={{ uri: userInfo?.photoURL }}
              />
            )}
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={signOut} title='Sign Out' icon='logout' />
        {isVendor && (
          <>
            <Menu.Item
              onPress={() => {
                navigate('VendorHome')
                closeMenu()
              }}
              disabled={routeName === 'VendorHome'}
              title='Profile'
              icon='account'
            />
            <Menu.Item
              onPress={() => {
                navigate('VendorEvents')
                closeMenu()
              }}
              disabled={routeName === 'VendorEvents'}
              title='Events'
              icon='calendar'
            />
          </>
        )}
      </Menu>
    </View>
  )
}

export default ScreenHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    marginRight: theme.spacing.md,
    color: '#999',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  menuContainer: {
    top: 60,
    paddingLeft: theme.spacing.sm,
  },
})
