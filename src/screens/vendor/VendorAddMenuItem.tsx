import React, { useState } from 'react'
import { Keyboard, SafeAreaView, View } from 'react-native'
import { TextInput as PTextInput, useTheme } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Formik } from 'formik'
import DropDown from 'react-native-paper-dropdown'

import {
  Button,
  DismissKeyboard,
  TextInput,
  Text,
  FormInputError,
} from '../../components'
import ModalContainer from '../../navigation/ModalContainer'

import { useVendor, MenuItem } from '../../hooks'

import {
  MENU_ITEM_SCHEMA,
  INIT_MENU_ITEM_VALUES,
  MENU_ITEM_CATEGORIES,
} from '../../utils/constants'

export default function VendorAddMenuItem() {
  const { fonts, spacing, presets } = useTheme()
  const { goBack } = useNavigation()
  const { params } = useRoute()
  const { addMenuItem, editMenuItem } = useVendor()
  const [isSaving, setIsSaving] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)

  const isEditing = params?.isEditing ? true : false

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

  return (
    <DismissKeyboard>
      <ModalContainer>
        <SafeAreaView style={presets.screenContainer}>
          <Formik
            enableReinitialize
            initialValues={isEditing ? params.menuItem : INIT_MENU_ITEM_VALUES}
            validationSchema={MENU_ITEM_SCHEMA}
            onSubmit={(values) =>
              isEditing ? handleEditMenuItem(values) : handleAddMenuItem(values)
            }
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <>
                <View style={presets.screenContent}>
                  <Text h2 style={{ marginTop: spacing.md }}>{`${
                    isEditing ? 'Edit' : 'Add'
                  } Menu Item`}</Text>
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
                    list={MENU_ITEM_CATEGORIES}
                    visible={showDropDown}
                    showDropDown={() => {
                      Keyboard.dismiss()
                      setShowDropDown(true)
                    }}
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
                  <Button
                    dense
                    loading={isSaving}
                    onPress={handleSubmit}
                    style={{ marginTop: spacing.sm }}
                  >
                    SUBMIT
                  </Button>
                  <Button dense mode='text' loading={isSaving} onPress={goBack}>
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
