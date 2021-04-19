import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigationState, useNavigation } from '@react-navigation/native'
import { Avatar, IconButton, Title } from 'react-native-paper'

import { useAuth } from '../hooks/useAuth'
import { theme } from '../style/theme'

type ScreenHeaderProps = {
  withAvatar?: boolean
  withBackButton?: boolean
}

const ScreenHeader = ({ withAvatar, withBackButton }: ScreenHeaderProps) => {
  const { navigate, goBack } = useNavigation()
  const { userInfo } = useAuth()

  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  )

  return (
    <View style={styles.container}>
      {withBackButton && (
        <IconButton
          icon='arrow-left'
          size={25}
          color={theme.colors.gray}
          onPress={() => goBack()}
        />
      )}
      <Title style={styles.title}>{routeName}</Title>
      {withAvatar && (
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigate('VendorProfile')}
        >
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
      )}
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
    marginHorizontal: theme.spacing.sm,
    color: '#999',
    // borderWidth: 1,
    // borderColor: 'black',
    flex: 1,
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
