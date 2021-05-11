import React, { useState, useEffect } from 'react'
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  Title,
  TextInput as PTextInput,
  Modal,
  Portal,
  useTheme,
} from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Formik } from 'formik'
import { format } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker'

// import DropDown from 'react-native-paper-dropdown'

import {
  Button,
  DismissKeyboard,
  TextInput,
  FormInputError,
} from '../../components'
import ModalContainer from '../../navigation/ModalContainer'

import { useVendor, MenuItem, Event } from '../../hooks'

import { EVENT_SCHEMA, INIT_EVENT_VALUES } from '../../utils/constants'

export default function VendorAddEvent() {
  const { colors, spacing, presets } = useTheme()
  const { goBack } = useNavigation()
  const { params } = useRoute()
  const { addMenuItem, editMenuItem } = useVendor()

  const [isEditing, setIsEditing] = useState(params?.isEditing ? true : false)
  const [initValues, setInitValues] = useState<Event>(
    isEditing ? params.event : INIT_EVENT_VALUES
  )
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // const [showDropDown, setShowDropDown] = useState(false)

  const handleAddMenuItem = async (values: MenuItem) => {
    console.log(values)
    // try {
    //   setIsSaving(true)
    //   Keyboard.dismiss()
    //   await addMenuItem(values)
    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   setIsSaving(false)
    //   goBack()
    // }
  }

  // const handleEditMenuItem = async (menuItem: MenuItem) => {
  //   try {
  //     setIsSaving(true)
  //     await editMenuItem(menuItem)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsSaving(false)
  //     goBack()
  //   }
  // }

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
            validationSchema={EVENT_SCHEMA}
            onSubmit={(values) => {
              console.log(values)
              // isEditing ? handleEditMenuItem(values) : handleAddMenuItem(values)
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setTouched,
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
                    {`${isEditing ? 'Edit' : 'Add'} Event`}
                  </Title>

                  <TouchableWithoutFeedback
                    onPress={() => {
                      setTouched({ ...touched, eventDate: true })
                      setShowDatePicker(true)
                    }}
                  >
                    <View>
                      <TextInput
                        dense
                        pointerEvents='none'
                        label='Event Date *'
                        value={
                          values.eventDate
                            ? format(values.eventDate, 'MM/dd/yyyy')
                            : ''
                        }
                        editable={false}
                        mode='outlined'
                      />
                      <FormInputError
                        error={errors.eventDate}
                        touched={touched.eventDate}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <Portal>
                    <Modal
                      visible={showDatePicker}
                      onDismiss={() => setShowDatePicker(false)}
                      contentContainerStyle={styles.modalContainer}
                    >
                      <Title style={styles.modalTitle}>Event Date</Title>
                      {/* Date piker goes here */}
                      <DateTimePicker
                        testID='dateTimePicker'
                        style={{
                          backgroundColor: '#f0f0f0',
                        }}
                        textColor='black'
                        value={values.eventDate ? values.eventDate : new Date()}
                        mode='date'
                        display='spinner'
                        onChange={(event, date) => {
                          setValues({ ...values, eventDate: date }, true)
                        }}
                      />
                    </Modal>
                  </Portal>

                  {/* <DropDown
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
                  /> */}
                </View>
                <View style={presets.screenActions}>
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

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 32,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalTitle: {
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 24,
  },
})
