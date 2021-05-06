import React, { useState, useEffect, useRef } from 'react'
import { Alert, Keyboard, StyleSheet, View } from 'react-native'
import { Avatar, List, FAB, Text, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { useVendor, MenuItem } from '../../hooks/useVendor'
import { Button } from '../../components'
import { theme } from '../../style/theme'

import { ScrollView } from 'react-native-gesture-handler'

const VendorProfileMenu = () => {
  const { spacing, colors } = useTheme()

  return (
    <View style={styles.container}>
      <ScrollView>
        <Button
          icon='plus'
          // onPress={toggleBottomSheet}
          style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}
        >
          Add Menu Item
        </Button>
      </ScrollView>
    </View>
  )
}

export default VendorProfileMenu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.xs,
  },
  addButtonContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
  },
  addButtonText: {
    color: theme.colors.darkGray,
    fontSize: 22,
    textAlign: 'center',
  },
})
