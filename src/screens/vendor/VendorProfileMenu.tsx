import React, { useState, useEffect, useRef } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { Avatar, List, FAB, Text, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { GOOGLE_PLACES_API_KEY } from '@env'
import * as ImagePicker from 'expo-image-picker'

import { useVendor, PopUp } from '../../hooks/useVendor'
import { TextInput, Button, FormInputError } from '../../components'
import { theme } from '../../style/theme'

import { INIT_POP_VALUES, POP_UP_SCHEMA } from '../../utils/constants'
import { ScrollView } from 'react-native-gesture-handler'

const VendorProfileMenu = () => {
  const { spacing, colors } = useTheme()

  return <View />
}

export default VendorProfileMenu

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   marginTop: theme.spacing.xs,
  // },
  // profileCardRow: {
  //   flexDirection: 'row',
  // },
  // profileCardItem: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   padding: theme.spacing.xs,
  //   marginTop: theme.spacing.xs,
  // },
  // profileCardText: {
  //   fontSize: 18,
  //   color: theme.colors.darkGray,
  // },
  // profileCardLabel: {
  //   color: theme.colors.gray,
  //   marginTop: theme.spacing.xxs,
  //   fontSize: 12,
  // },
  // fab: {
  //   position: 'absolute',
  //   zIndex: 2,
  //   top: 0,
  //   right: 0,
  //   margin: theme.spacing.xs,
  //   backgroundColor: 'white',
  //   shadowOpacity: 0,
  // },
  // logoPickerContainer: {
  //   flexDirection: 'row',
  //   width: '100%',
  //   marginTop: theme.spacing.md,
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
})
