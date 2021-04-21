import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import { Formik } from 'formik'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { MENU_ITEM_SCHEMA, INIT_MENU_ITEM_VALUES } from '../../utils/constants'
import { useVendor, MenuItem } from '../../hooks'

import {
  Button,
  BottomSheet,
  DismissKeyboard,
  FAB,
  TextInput,
  FormInputError,
  ScreenHeader,
} from '../../components'

export default function VendorMenuItems() {
  const { presets, spacing } = useTheme()
  const { addMenuItemToPopUp } = useVendor()
  const sheetRef = useRef<ReanimatedBottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddMenuItem = async (values: MenuItem) => {
    try {
      setIsSaving(true)
      await addMenuItemToPopUp(values)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      setIsOpen(false)
    }
  }

  const toggleBottomSheet = () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (isOpen) {
      sheetRef?.current?.snapTo(0)
    } else {
      sheetRef?.current?.snapTo(1)
    }
  }, [isOpen])

  return (
    <DismissKeyboard>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={presets.screenContainer}>
          <ScreenHeader withBackButton />
          <View style={presets.screenContent}></View>
        </SafeAreaView>
        <FAB icon='plus' onPress={toggleBottomSheet} isOpen={isOpen} />
        <BottomSheet
          ref={sheetRef}
          header='Add Menu Item'
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          content={
            <Formik
              enableReinitialize
              initialValues={INIT_MENU_ITEM_VALUES}
              validationSchema={MENU_ITEM_SCHEMA}
              onSubmit={handleAddMenuItem}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setValues,
                values,
                errors,
                touched,
                isValid,
                dirty,
              }) => (
                <>
                  <TextInput
                    label='Item Name'
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                  <FormInputError error={errors.name} touched={touched.name} />

                  <TextInput
                    label='Price ( $ )'
                    // keyboardType='decimal-pad'
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price}
                  />
                  <FormInputError
                    error={errors.price}
                    touched={touched.price}
                  />

                  <TextInput
                    label='Item Description'
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  <FormInputError
                    error={errors.description}
                    touched={touched.description}
                  />

                  <Button
                    mode='text'
                    loading={isSaving}
                    onPress={handleSubmit}
                    style={{ marginTop: spacing.lg }}
                  >
                    SUBMIT
                  </Button>
                </>
              )}
            </Formik>
          }
        />
      </View>
    </DismissKeyboard>
  )
}
