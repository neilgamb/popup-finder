import React, { useState, useEffect, useRef } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { Avatar, List, FAB, Text, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { GOOGLE_PLACES_API_KEY } from '@env'
import * as ImagePicker from 'expo-image-picker'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import { useVendor, PopUp } from '../../hooks/useVendor'
import { TextInput, Button, FormInputError, Card } from '../../components'
import { theme } from '../../style/theme'
import { mapStyle } from '../../style/mapStyle'

import { INIT_POP_VALUES, POP_UP_SCHEMA } from '../../utils/constants'
import { ScrollView } from 'react-native-gesture-handler'

const VendorProfileInfo = () => {
  const { spacing, colors, roundness } = useTheme()
  const { goBack } = useNavigation()
  const {
    addPopUp,
    editPopUp,
    deletePopUp,
    isVendorSetup,
    activePopUp,
  } = useVendor()

  const [locationQuery, setLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [logoImageUri, setLogoImageUri] = useState('')

  const scrollRef = useRef<ScrollView>(null)

  const handleLocationSearch = (locationQuery: string) => {
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery}&key=${GOOGLE_PLACES_API_KEY}`
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then(({ predictions }) => setLocationResults(predictions))
  }

  const handleAddPopUp = async (values: any) => {
    try {
      setIsSaving(true)
      await addPopUp(values, logoImageUri)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
      goBack()
    }
  }

  const handleEditPopUp = async (values: any) => {
    try {
      setIsSaving(true)
      await editPopUp(values, logoImageUri)
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePopUp = async () => {
    Alert.alert(
      'Temporarily Disabled',
      'This functionality is setup, but disabled until Vendor Events are set up',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    )
    // try {
    //   setIsSaving(true)
    //   await deletePopUp(activePopUp.popUpUid)
    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   setIsSaving(false)
    // }
  }

  const handleLogoImageSelect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setLogoImageUri(result.uri)
    }
  }

  const handleMediaLibraryPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  useEffect(() => {
    if (isEditing && activePopUp.logoImageUrl) {
      setLogoImageUri(activePopUp.logoImageUrl)
    }
  }, [isEditing])

  useEffect(() => {
    handleLocationSearch(locationQuery)
  }, [locationQuery])

  useEffect(() => {
    handleMediaLibraryPermissions()
  }, [])

  const logoImageChanged =
    activePopUp && activePopUp.logoImageUrl !== logoImageUri

  return (
    <Formik
      enableReinitialize
      initialValues={isEditing ? activePopUp : INIT_POP_VALUES}
      validationSchema={POP_UP_SCHEMA}
      onSubmit={(values) =>
        isEditing ? handleEditPopUp(values) : handleAddPopUp(values)
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
        <View style={[styles.container]}>
          <ScrollView ref={scrollRef}>
            <Card style={{ marginTop: spacing.md, padding: spacing.md }}>
              {isVendorSetup && (
                <FAB
                  small
                  style={styles.fab}
                  icon={isEditing ? 'check' : 'pencil'}
                  disabled={
                    isEditing && !(dirty && isValid) && !logoImageChanged
                  }
                  onPress={() =>
                    isEditing ? handleSubmit() : setIsEditing(true)
                  }
                />
              )}
              {isEditing && (
                <FAB
                  style={{ ...styles.fab, marginRight: 48 }}
                  icon='close'
                  small
                  onPress={() => setIsEditing(false)}
                />
              )}
              {isEditing && (
                <FAB
                  style={{ ...styles.fab, marginRight: 88 }}
                  icon='delete'
                  small
                  onPress={handleDeletePopUp}
                />
              )}
              {isVendorSetup && !isEditing ? (
                <>
                  <View style={styles.profileCardRow}>
                    <View style={{ ...styles.profileCardItem, marginTop: 0 }}>
                      <Text style={{ ...styles.profileCardText, fontSize: 24 }}>
                        {activePopUp?.name}
                      </Text>
                      <Text style={styles.profileCardLabel}>POP UP NAME</Text>
                    </View>
                  </View>
                  <View style={styles.profileCardRow}>
                    <View style={styles.profileCardItem}>
                      <Text style={styles.profileCardText}>
                        {activePopUp?.foodType}
                      </Text>
                      <Text style={styles.profileCardLabel}>FOOD TYPE</Text>
                    </View>
                    <View style={styles.profileCardItem}>
                      <Text style={styles.profileCardText}>
                        {activePopUp?.location.split(',')[0]}
                      </Text>
                      <Text style={styles.profileCardLabel}>CITY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCardItem}>
                    <Text style={styles.profileCardText}>
                      {activePopUp?.description}
                    </Text>
                    <Text style={styles.profileCardLabel}>DESCRIPTION</Text>
                  </View>
                </>
              ) : (
                <>
                  {!isVendorSetup && (
                    <Text
                      style={{
                        marginTop: spacing.sm,
                        marginLeft: spacing.xs,
                        fontSize: 18,
                        color: colors.gray,
                      }}
                    >
                      Please set up your Pop Up profile
                    </Text>
                  )}

                  <TextInput
                    label='Pop Up Name'
                    value={values.name}
                    style={{ marginTop: spacing.lg }}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    onFocus={() =>
                      scrollRef.current?.scrollTo({
                        x: 0,
                        y: 100,
                        animated: true,
                      })
                    }
                  />
                  <FormInputError error={errors.name} touched={touched.name} />

                  <TextInput
                    label='Location'
                    value={values.location}
                    onChangeText={(text) => {
                      setLocationQuery(text)
                      setValues({ ...values, location: text })
                    }}
                    onBlur={handleBlur('location')}
                    onFocus={() =>
                      scrollRef.current?.scrollTo({
                        x: 0,
                        y: 200,
                        animated: true,
                      })
                    }
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
                                  locationData: result,
                                  ...values,
                                  location: locResult.description,
                                })
                                setLocationResults([])
                                setLocationQuery('')
                              }
                            )
                        }}
                      />
                    )
                  )}

                  <TextInput
                    label='Food Type'
                    value={values.foodType}
                    onChangeText={handleChange('foodType')}
                    onBlur={handleBlur('foodType')}
                    onFocus={() =>
                      scrollRef.current?.scrollTo({
                        x: 0,
                        y: 300,
                        animated: true,
                      })
                    }
                  />
                  <FormInputError
                    error={errors.foodType}
                    touched={touched.foodType}
                  />

                  <TextInput
                    label='Description'
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  <FormInputError
                    error={errors.description}
                    touched={touched.description}
                  />

                  <View style={styles.logoPickerContainer}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {!!logoImageUri && (
                        <Avatar.Image
                          style={{
                            backgroundColor: '#f0f0f0',
                            marginHorizontal: spacing.sm,
                          }}
                          size={40}
                          source={{
                            uri: logoImageUri,
                          }}
                        />
                      )}

                      <Button
                        mode='text'
                        style={{ marginTop: 0 }}
                        labelStyle={{ fontSize: 16 }}
                        loading={isSaving}
                        onPress={handleLogoImageSelect}
                      >
                        Select Logo
                      </Button>
                    </View>

                    {!isVendorSetup && (
                      <FAB
                        icon='content-save'
                        color='white'
                        disabled={!(dirty && isValid)}
                        onPress={handleSubmit}
                      />
                    )}
                  </View>
                </>
              )}
            </Card>
            <Card>
              {/* <View style={{ ...styles.profileCardItem, marginTop: 0 }}>
                <Text style={{ ...styles.profileCardText, fontSize: 24 }}>
                  Placeholder for Images section
                </Text>
              </View> */}
              <MapView
                style={{ flex: 1, height: 200, borderRadius: roundness }}
                scrollEnabled={false}
                mapType='standard'
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                initialRegion={{
                  latitude: activePopUp.locationData.geometry?.location?.lat,
                  longitude: activePopUp.locationData.geometry?.location?.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
            </Card>
            <Card style={{ marginBottom: spacing.xl, padding: spacing.md }}>
              <View style={{ ...styles.profileCardItem, marginTop: 0 }}>
                <Text style={{ ...styles.profileCardText, fontSize: 24 }}>
                  Placeholder for Images section
                </Text>
              </View>
            </Card>
          </ScrollView>
        </View>
      )}
    </Formik>
  )
}

export default VendorProfileInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.xs,
  },
  profileCardRow: {
    flexDirection: 'row',
  },
  profileCardItem: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  profileCardText: {
    fontSize: 18,
    color: theme.colors.darkGray,
  },
  profileCardLabel: {
    color: theme.colors.gray,
    marginTop: theme.spacing.xxs,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    right: 0,
    margin: theme.spacing.xs,
    backgroundColor: 'white',
    shadowOpacity: 0,
  },
  logoPickerContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
