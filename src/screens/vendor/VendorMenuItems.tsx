import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, TouchableOpacity, ScrollView, View } from 'react-native'
import { List, useTheme } from 'react-native-paper'
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
  const { presets, spacing, withBorder } = useTheme()
  const { menuItems, addMenuItem, deleteMenuItem, editMenuItem } = useVendor()
  const sheetRef = useRef<ReanimatedBottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [initValues, setInitValues] = useState<MenuItem>(INIT_MENU_ITEM_VALUES)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddMenuItem = async (values: MenuItem) => {
    try {
      setIsSaving(true)
      await addMenuItem(values)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      setIsOpen(false)
    }
  }

  const handleEditMenuItem = async (menuItem: MenuItem) => {
    try {
      setIsSaving(true)
      await editMenuItem(menuItem)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      setIsOpen(false)
    }
  }

  const handleDeleteMenuItem = async (menuItem: MenuItem) => {
    try {
      setIsSaving(true)
      await deleteMenuItem(menuItem.menuItemUid)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleBottomSheet = () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  const openEditBottomSheet = (menuItem: MenuItem) => {
    setIsEditing(true)
    setInitValues(menuItem)
    setIsOpen(true)
  }

  useEffect(() => {
    if (isOpen) {
      sheetRef?.current?.snapTo(0)
    } else {
      sheetRef?.current?.snapTo(1)
      setInitValues(INIT_MENU_ITEM_VALUES)
      setIsEditing(false)
    }
  }, [isOpen])

  return (
    <DismissKeyboard>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={presets.screenContainer}>
          <ScreenHeader withBackButton />
          <ScrollView
            style={{ ...presets.screenContent, paddingHorizontal: 0 }}
          >
            {menuItems.map((menuItem, i) => (
              <List.Item
                key={i}
                title={`${menuItem.name} $${menuItem.price}`}
                description={menuItem.description}
                right={(props) => (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => openEditBottomSheet(menuItem)}
                    >
                      <List.Icon
                        {...props}
                        icon='pencil'
                        style={{ margin: 0 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteMenuItem(menuItem)}
                    >
                      <List.Icon
                        {...props}
                        icon='delete'
                        style={{ margin: 0 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
        <FAB icon='plus' onPress={toggleBottomSheet} isOpen={isOpen} />
        <BottomSheet
          ref={sheetRef}
          header={`${isEditing ? 'Edit' : 'Add'} Menu Item`}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          content={
            <Formik
              enableReinitialize
              initialValues={initValues}
              validationSchema={MENU_ITEM_SCHEMA}
              onSubmit={(values) =>
                isEditing
                  ? handleEditMenuItem(values)
                  : handleAddMenuItem(values)
              }
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
                    keyboardType='decimal-pad'
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
