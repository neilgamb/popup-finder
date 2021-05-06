import React, { useState, useEffect } from 'react'
import { Keyboard, SafeAreaView, StyleSheet, View } from 'react-native'
import { Title, TextInput as PTextInput, useTheme } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'

import {
  Button,
  DismissKeyboard,
  TextInput,
  FormInputError,
} from '../../components'
import ModalContainer from '../../navigation/ModalContainer'

import { useVendor, MenuItem } from '../../hooks'

import { MENU_ITEM_SCHEMA, INIT_MENU_ITEM_VALUES } from '../../utils/constants'
import { theme } from '../../style/theme'

export default function VendorAddMenuItem() {
  const { fonts, spacing, presets } = useTheme()
  const { goBack } = useNavigation()
  const { menuItems, addMenuItem, deleteMenuItem, editMenuItem } = useVendor()

  const [isEditing, setIsEditing] = useState(false)
  const [initValues, setInitValues] = useState<MenuItem>(INIT_MENU_ITEM_VALUES)
  const [isSaving, setIsSaving] = useState(false)

  const [showDropDown, setShowDropDown] = useState(false)
  const [gender, setGender] = useState()
  const genderList = [
    { label: 'Male', value: 'male' },

    { label: 'Female', value: 'female' },

    { label: 'Others', value: 'others' },
  ]

  const handleAddMenuItem = async (values: MenuItem) => {
    try {
      setIsSaving(true)
      Keyboard.dismiss()
      await addMenuItem(values)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      goBack()
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
      goBack()
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

  // useEffect(() => {
  //   if (isOpen) {
  //     sheetRef?.current?.snapTo(0)
  //     Keyboard.dismiss()
  //   } else {
  //     sheetRef?.current?.snapTo(1)
  //     setInitValues(INIT_MENU_ITEM_VALUES)
  //     setIsEditing(false)
  //   }
  // }, [isOpen])

  return (
    <DismissKeyboard>
      <ModalContainer>
        <SafeAreaView style={presets.screenContainer}>
          <Formik
            enableReinitialize
            initialValues={initValues}
            validationSchema={MENU_ITEM_SCHEMA}
            onSubmit={(values) =>
              isEditing ? handleEditMenuItem(values) : handleAddMenuItem(values)
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
                <View style={presets.screenContent}>
                  <Title
                    style={{
                      fontSize: 24,
                      marginLeft: spacing.xs,
                      marginTop: spacing.md,
                    }}
                  >
                    Add Menu Item
                  </Title>
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
                  <DropDown
                    label={'Menu Category'}
                    mode={'outlined'}
                    value={values.category}
                    setValue={handleChange('category')}
                    list={genderList}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    inputProps={{
                      right: (
                        <PTextInput.Icon
                          name={showDropDown ? 'menu-up' : 'menu-down'}
                        />
                      ),
                      style: {
                        marginTop: spacing.sm,
                        backgroundColor: 'white',
                        ...fonts.input,
                      },
                    }}
                  />
                </View>
                <View style={[presets.screenActions]}>
                  <Button loading={isSaving} onPress={handleSubmit}>
                    SUBMIT
                  </Button>
                  <Button
                    mode='text'
                    loading={isSaving}
                    onPress={goBack}
                    style={{ marginTop: spacing.sm }}
                  >
                    DISMISS
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </SafeAreaView>
      </ModalContainer>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({})
