import React, { useState, useEffect } from 'react'
import {
  Alert,
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

import { useVendor, useEvents, MenuItem, Event } from '../../hooks'

import {
  EVENT_SCHEMA,
  INIT_EVENT_VALUES,
  MENU_ITEM_CATEGORIES,
} from '../../utils/constants'

import { theme } from '../../style/theme'

export default function VendorAddEvent() {
  const { fonts, spacing, presets, colors, withBorder } = useTheme()
  const { goBack, navigate } = useNavigation()
  const { params } = useRoute()
  const { menuItems, activePopUp } = useVendor()
  const { addEvent, editEvent, deleteEvent } = useEvents()

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [locationQuery, setLocationQuery] = useState<string>('')
  const [locationResults, setLocationResults] = useState([])
  const [menuItemSelections, setMenuItemSelections] = useState<Array<MenuItem>>(
    []
  )

  const isEditing = params?.isEditing ? true : false

  const handleAddEvent = async (values: Event) => {
    try {
      setIsSaving(true)
      Keyboard.dismiss()
      await addEvent({
        ...values,
        popUp: activePopUp.name,
        popUpUid: activePopUp.popUpUid,
        userUid: activePopUp.userUid,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      goBack()
    }
  }

  const handleEditEvent = async (values: Event) => {
    try {
      setIsSaving(true)
      await editEvent(values)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      goBack()
    }
  }

  const handleDeleteEvent = () => {
    Alert.alert('Are you sure?', 'All event data will be lost', [
      {
        text: 'OK',
        onPress: async () => {
          try {
            setIsSaving(true)
            await deleteEvent(params.event.eventUid)
          } catch (error) {
            console.log(error)
          } finally {
            setIsSaving(false)
            goBack()
          }
        },
      },
      {
        text: 'CANCEL',
        onPress: () => console.log('event delete canceled'),
      },
    ])
  }

  const handleLocationSearch = (locationQuery: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then(({ predictions }) => setLocationResults(predictions))
  }

  useEffect(() => {
    handleLocationSearch(locationQuery)
  }, [locationQuery])

  useEffect(() => {
    isEditing && setMenuItemSelections(params.event.menu)
  }, [])

  const categories = MENU_ITEM_CATEGORIES.map((c) => {
    if (menuItems.some((e) => e.category === c.value)) {
      return c.value
    }
  })

  return (
    <DismissKeyboard>
      <ModalContainer>
        <SafeAreaView style={presets.screenContainer}>
          <Formik
            enableReinitialize
            initialValues={
              isEditing
                ? {
                    ...params.event,
                    eventDate: params.event.eventDate.toDate(),
                  }
                : INIT_EVENT_VALUES
            }
            validationSchema={EVENT_SCHEMA}
            onSubmit={(values) => {
              isEditing ? handleEditEvent(values) : handleAddEvent(values)
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
                      <Button
                        loading={isSaving}
                        onPress={() => {
                          setValues({
                            ...values,
                            eventDate: !!values.eventDate
                              ? values.eventDate
                              : new Date(),
                          })
                          setShowDatePicker(false)
                        }}
                        style={{
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                        }}
                      >
                        SELECT
                      </Button>
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
                  {menuItemSelections.length === 0 && !isValid && (
                    <FormInputError
                      error={'Please set a menu'}
                      touched={true}
                    />
                  )}
                  <ScrollView>
                    <View style={{ marginBottom: 50 }}>
                      <List.Item
                        title='Add Menu Item'
                        titleStyle={{ left: -spacing.sm }}
                        onPress={() => navigate('VendorAddMenuItem')}
                        left={(props) => (
                          <List.Icon {...props} icon='plus-circle' />
                        )}
                      />
                      {categories.map((category, catI) => {
                        return (
                          category && (
                            <View key={catI}>
                              <List.Item
                                title={
                                  category.charAt(0).toUpperCase() +
                                  category.slice(1)
                                }
                                titleStyle={{ textDecorationLine: 'underline' }}
                                style={{ paddingVertical: 0 }}
                              />
                              {menuItems.map((menuItem, mII) => {
                                if (menuItem.category === category) {
                                  return (
                                    <List.Item
                                      key={mII}
                                      title={`${menuItem.name} $${menuItem.price}`}
                                      left={() => (
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
                                            const isSelected =
                                              menuItemSelections.some(
                                                (e) => e.name === menuItem.name
                                              )
                                            if (isSelected) {
                                              selections =
                                                menuItemSelections.filter(
                                                  (e) =>
                                                    e.name !== menuItem.name
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
                    </View>
                  </ScrollView>
                </View>
                <View style={presets.screenActions}>
                  <Button
                    loading={isSaving}
                    onPress={handleSubmit}
                    style={{ marginTop: spacing.sm }}
                  >
                    SUBMIT
                  </Button>
                  {isEditing && (
                    <Button
                      mode='text'
                      loading={isSaving}
                      onPress={handleDeleteEvent}
                      labelStyle={{ ...fonts.button, color: colors.accent }}
                    >
                      DELETE
                    </Button>
                  )}
                  <Button mode='text' loading={isSaving} onPress={goBack}>
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
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: theme.spacing.md,
  },
})
