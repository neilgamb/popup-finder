import React from 'react'
import { StyleSheet, View } from 'react-native'
import { theme } from '../style/theme'

interface ProfileCardProps {
  children: React.ReactNode
  style: any
}

const ProfileCard = ({ children, style }: ProfileCardProps) => (
  <View style={{ ...styles.profileCardContainer, ...style }}>{children}</View>
)

export default ProfileCard

const styles = StyleSheet.create({
  profileCardContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.roundness,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    position: 'relative',
    ...theme.boxShadow,
  },
})
