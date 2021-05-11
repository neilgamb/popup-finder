import React, { useState, useEffect } from 'react'
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  Checkbox,
  Title,
  TextInput as PTextInput,
  Modal,
  Portal,
  List,
  useTheme,
} from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Formik } from 'formik'
import { format } from 'date-fns'
import { GOOGLE_PLACES_API_KEY } from '@env'
import DateTimePicker from '@react-native-community/datetimepicker'

import {
  Button,
  DismissKeyboard,
  TextInput,
  FormInputError,
} from '../../components'
import ModalContainer from '../../navigation/ModalContainer'

import { useVendor, MenuItem, Event } from '../../hooks'

import {
  EVENT_SCHEMA,
  INIT_EVENT_VALUES,
  MENU_ITEM_CATEGORIES,
} from '../../utils/constants'

import { theme } from '../../style/theme'

export default function VendorAddEvent() {
  const { fonts, spacing, presets, colors } = useTheme()
  const { goBack } = useNavigation()
  const { params } = useRoute()
  const { addMenuItem, editMenuItem, menuItems } = useVendor()

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [locationQuery, setLocationQuery] = useState<string>('')
  const [locationResults, setLocationResults] = useState([])
  const [menuItemSelections, setMenuItemSelections] = useState<Array<MenuItem>>(
    []
  )

  const isEditing = params?.isEditing ? true : false

  // const handleAddMenuItem = async (values: MenuItem) => {
  //   try {
  //     setIsSaving(true)
  //     Keyboard.dismiss()
  //     await addMenuItem(values)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsSaving(false)
  //     goBack()
  //   }
  // }

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

  const handleLocationSearch = (locationQuery: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then(({ predictions }) => setLocationResults(predictions))
  }

  useEffect(() => {
    handleLocationSearch(locationQuery)
  }, [locationQuery])

  const categories = MENU_ITEM_CATEGORIES.map((c) => {
    if (menuItems.some((e) => e.category === c.value)) {
      return c.value
    }
  })

  const [checked, setChecked] = React.useState(false)

  useEffect(() => {
    console.log(menuItemSelections)
  }, [menuItemSelections])

  return (
    <DismissKeyboard>
      <ModalContainer>
        <SafeAreaView style={presets.screenContainer}>
          <Formik
            enableReinitialize
            initialValues={isEditing ? params.event : INIT_EVENT_VALUES}
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
                  <Title style={fonts.title}>
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
                      <Title style={[fonts.title, styles.modalTitle]}>
                        Event Date
                      </Title>
                      {/* Date piker goes here */}
                      <DateTimePicker
                        testID='dateTimePicker'
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

                  <TextInput
                    label='Location'
                    value={values.location.split(',')[0]}
                    onChangeText={(text) => {
                      setLocationQuery(text)
                      setValues({ ...values, location: text })
                    }}
                    onBlur={handleBlur('location')}
                  />
                  <FormInputError
                    error={errors.location}
                    touched={touched.location}
                  />
                  {locationResults?.map(
                    (
                      locResult: google.maps.places.AutocompletePrediction,
                      i
                    ) => (
                      <List.Item
                        key={i}
                        title={locResult.description}
                        onPress={() => {
                          const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${locResult.place_id}&key=${GOOGLE_PLACES_API_KEY}`
                          fetch(url)
                            .then((response) => response.json())
                            .then(
                              ({
                                result,
                              }: {
                                result: google.maps.places.PlaceResult
                              }) => {
                                setValues({
                                  ...values,
                                  locationData: result,
                                  location: locResult.description,
                                })
                                setLocationResults([])
                                setLocationQuery('')
                                Keyboard.dismiss()
                              }
                            )
                        }}
                      />
                    )
                  )}
                  <Title style={[fonts.title]}>Menu</Title>
                  <ScrollView>
                    {categories.map((category, catI) => {
                      return (
                        category && (
                          <View key={catI}>
                            {/* <List.Item
                              title={
                                category.charAt(0).toUpperCase() +
                                category.slice(1)
                              }
                              titleStyle={{
                                fontSize: 18,
                                fontWeight: '600',
                              }}
                            /> */}
                            {menuItems.map((menuItem, mII) => {
                              if (menuItem.category === category) {
                                return (
                                  <List.Item
                                    key={mII}
                                    title={`${menuItem.name} $${menuItem.price}`}
                                    // description={menuItem.description}
                                    left={(props) => (
                                      <Checkbox.Android
                                        uncheckedColor={colors.lightGray}
                                        status={
                                          menuItemSelections.some(
                                            (e) => e.name === menuItem.name
                                          )
                                            ? 'checked'
                                            : 'unchecked'
                                        }
                                        onPress={() => {
                                          let selections
                                          if (
                                            menuItemSelections.some(
                                              (e) => e.name === menuItem.name
                                            )
                                          ) {
                                            selections = menuItemSelections.filter(
                                              (e) => e.name !== menuItem.name
                                            )
                                          } else {
                                            selections = [
                                              ...menuItemSelections,
                                              menuItem,
                                            ]
                                          }
                                          setMenuItemSelections(selections)
                                          setValues({
                                            ...values,
                                            menu: selections,
                                          })
                                        }}
                                      />
                                    )}
                                  />
                                )
                              }
                            })}
                          </View>
                        )
                      )
                    })}
                  </ScrollView>
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
    fontSize: 24,
    marginBottom: theme.spacing.md,
  },
})
