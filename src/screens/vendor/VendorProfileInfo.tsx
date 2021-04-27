import React, { useState, useEffect } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import {
  Avatar,
  Headline,
  Title,
  List,
  FAB,
  Text,
  useTheme,
} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { GOOGLE_PLACES_API_KEY } from '@env'
import * as ImagePicker from 'expo-image-picker'

import { useAuth } from '../../hooks/useAuth'
import { useVendor, PopUp } from '../../hooks/useVendor'
import { TextInput, Button, FormInputError } from '../../components'
import { theme, withBorder } from '../../style/theme'

import { INIT_POP_VALUES, POP_UP_SCHEMA } from '../../utils/constants'
import { ScrollView } from 'react-native-gesture-handler'

const VendorProfileInfo = () => {
  const { spacing } = useTheme()
  const { goBack } = useNavigation()
  const { userInfo } = useAuth()
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
    console.log(activePopUp)
  }, [])

  const logoImageChanged = activePopUp.logoImageUrl !== logoImageUri

  console.log(logoImageChanged)

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
          <ScrollView>
            <ProfileCard style={{ marginTop: spacing.md }}>
              <FAB
                style={styles.fab}
                icon={isEditing ? 'check' : 'pencil'}
                disabled={isEditing && !(dirty && isValid) && !logoImageChanged}
                onPress={() =>
                  isEditing ? handleSubmit() : setIsEditing(true)
                }
              />
              {isEditing && (
                <FAB
                  style={styles.secondaryFab}
                  icon='close'
                  small
                  onPress={() => setIsEditing(false)}
                />
              )}
              {isEditing && (
                <FAB
                  style={styles.tertiaryFab}
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
                        {activePopUp.name}
                      </Text>
                      <Text style={styles.profileCardLabel}>POP UP NAME</Text>
                    </View>
                  </View>
                  <View style={styles.profileCardRow}>
                    <View style={styles.profileCardItem}>
                      <Text style={styles.profileCardText}>
                        {activePopUp.foodType}
                      </Text>
                      <Text style={styles.profileCardLabel}>FOOD TYPE</Text>
                    </View>
                    <View style={styles.profileCardItem}>
                      <Text style={styles.profileCardText}>
                        {activePopUp.location}
                      </Text>
                      <Text style={styles.profileCardLabel}>CITY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCardItem}>
                    <Text style={styles.profileCardText}>
                      {activePopUp.description}
                    </Text>
                    <Text style={styles.profileCardLabel}>DESCRIPTION</Text>
                  </View>
                </>
              ) : (
                <>
                  {!isVendorSetup && (
                    <>
                      <Headline>
                        Welcome, {userInfo?.displayName?.split(' ')[0]}
                      </Headline>
                      <Title style={{ marginTop: spacing.sm }}>
                        Please set up your Pop Up profile:
                      </Title>
                    </>
                  )}

                  <TextInput
                    label='Pop Up Name'
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                  <FormInputError error={errors.name} touched={touched.name} />

                  <TextInput
                    label='Location'
                    onChangeText={(text) => {
                      setLocationQuery(text)
                      setValues({ ...values, location: text })
                    }}
                    onBlur={handleBlur('location')}
                    value={values.location}
                  />
                  <FormInputError
                    error={errors.location}
                    touched={touched.location}
                  />
                  {locationResults?.map((result: PopUp, i) => (
                    <List.Item
                      key={i}
                      title={result.description}
                      onPress={() => {
                        setValues({
                          ...values,
                          location: result.description,
                        })
                        setLocationResults([])
                        setLocationQuery('')
                      }}
                    />
                  ))}

                  <TextInput
                    label='Food Type'
                    onChangeText={handleChange('foodType')}
                    onBlur={handleBlur('foodType')}
                    value={values.foodType}
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

                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: spacing.md,
                      alignItems: 'center',
                    }}
                  >
                    {!!logoImageUri && (
                      <Avatar.Image
                        style={{
                          backgroundColor: '#f0f0f0',
                          marginHorizontal: spacing.sm,
                        }}
                        size={60}
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
                </>
              )}
            </ProfileCard>
            <ProfileCard style={{ marginBottom: spacing.xl }}>
              <View style={{ ...styles.profileCardItem, marginTop: 0 }}>
                <Text style={{ ...styles.profileCardText, fontSize: 24 }}>
                  Placeholder for Images section
                </Text>
              </View>
            </ProfileCard>
          </ScrollView>
        </View>
      )}
    </Formik>
  )
}

export default VendorProfileInfo

interface ProfileCardProps {
  children: React.ReactNode
  style: any
}

const ProfileCard = ({ children, style }: ProfileCardProps) => (
  <View style={{ ...styles.profileCardContainer, ...style }}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.xs,
  },
  profileCardContainer: {
    flex: 1,
    backgroundColor: theme.colors.offWhite,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.roundness,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    position: 'relative',
    ...theme.boxShadow,
  },
  profileCardRow: {
    flexDirection: 'row',
  },
  profileCardItem: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    // ...withBorder,
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
    right: 12,
    top: -24,
    backgroundColor: theme.colors.gray,
    zIndex: 2,
  },
  secondaryFab: {
    position: 'absolute',
    right: 80,
    top: -16,
    backgroundColor: theme.colors.lightGray,
    zIndex: 2,
  },
  tertiaryFab: {
    position: 'absolute',
    right: 130,
    top: -16,
    backgroundColor: theme.colors.lightGray,
    zIndex: 2,
  },
})
