import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Avatar, IconButton } from 'react-native-paper'

import { Text } from '../components'
import { useAuth, useVendor } from '../hooks'
import { theme } from '../style/theme'

type ScreenHeaderProps = {
  withAvatar?: boolean
  withBackButton?: boolean
}

const ScreenHeader = ({ withAvatar, withBackButton }: ScreenHeaderProps) => {
  const { navigate, goBack } = useNavigation()
  const { userInfo } = useAuth()
  const { activePopUp } = useVendor()
  const route = useRoute()

  return (
    <View style={styles.container}>
      {withBackButton && (
        <IconButton
          icon='arrow-left'
          size={25}
          color={theme.colors.gray}
          style={{ marginRight: theme.spacing.md }}
          onPress={() => goBack()}
        />
      )}
      <Text h2>{route.name}</Text>
      {withAvatar && (
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigate('VendorProfile', { activePopUp })}
        >
          {userInfo?.isAnonymous ? (
            <Avatar.Icon
              icon='account'
              style={{ backgroundColor: theme.colors.extraLightGray }}
              size={50}
            />
          ) : activePopUp !== null ? (
            <Avatar.Image
              style={{ backgroundColor: theme.colors.extraLightGray }}
              size={50}
              source={{
                uri: activePopUp.logoImageUrl,
              }}
            />
          ) : (
            <Avatar.Image
              style={{ backgroundColor: theme.colors.extraLightGray }}
              size={50}
              //@ts-ignore
              source={{
                uri: userInfo?.photoURL,
              }}
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
    color: '#999',
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
