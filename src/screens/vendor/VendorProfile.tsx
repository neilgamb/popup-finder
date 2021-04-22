import React, { useState, useEffect } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'
import { Headline, Title, List, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { GOOGLE_PLACES_API_KEY } from '@env'
import auth from '@react-native-firebase/auth'

import { useAuth } from '../../hooks/useAuth'
import { useVendor, PopUp } from '../../hooks/useVendor'
import {
  ScreenHeader,
  TextInput,
  Button,
  DismissKeyboard,
  FormInputError,
} from '../../components'

import { INIT_POP_VALUES, POP_UP_SCHEMA } from '../../utils/constants'

const VendorProfile = () => {
  const { presets, spacing } = useTheme()
  const { navigate, goBack } = useNavigation()
  const { userInfo } = useAuth()
  const {
    addPopUp,
    editPopUp,
    deletePopUp,
    resetVendor,
    isVendorSetup,
    activePopUp,
  } = useVendor()

  const [locationQuery, setLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
      await addPopUp(values)
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
      await editPopUp(values)
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

  const handleSelectLogo = () => {}

  const signOut = async () => {
    try {
      await auth().signOut()
      resetVendor()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    handleLocationSearch(locationQuery)
  }, [locationQuery])

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
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
            <>
              <ScreenHeader />
              <ScrollView style={presets.screenContent}>
                {isVendorSetup && !isEditing ? (
                  <>
                    <List.Item
                      title={activePopUp?.name}
                      description='Pop Up Name'
                      left={(props) => (
                        <List.Icon {...props} icon='hamburger' />
                      )}
                      style={{ marginTop: spacing.md }}
                    />
                    <List.Item
                      title={activePopUp?.location}
                      description='Location'
                      left={(props) => (
                        <List.Icon {...props} icon='map-marker' />
                      )}
                    />
                    <List.Item
                      title={activePopUp?.foodType}
                      description='Food Type'
                      left={(props) => <List.Icon {...props} icon='earth' />}
                    />
                    <List.Item
                      title={activePopUp?.description}
                      description='Description'
                      left={(props) => <List.Icon {...props} icon='note' />}
                    />
                    <List.Item
                      title='Menu Items'
                      description='Tap to Edit'
                      left={(props) => (
                        <List.Icon {...props} icon='format-list-bulleted' />
                      )}
                      onPress={() => navigate('VendorMenuItems')}
                    />
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
                    <FormInputError
                      error={errors.name}
                      touched={touched.name}
                    />

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

                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <Button
                        mode='text'
                        // compact
                        labelStyle={{ fontSize: 16 }}
                        loading={isSaving}
                        onPress={handleSelectLogo}
                      >
                        Select Logo
                      </Button>
                    </View>
                  </>
                )}
              </ScrollView>
              <View style={presets.screenActions}>
                {isVendorSetup && !isEditing ? (
                  <>
                    <Button
                      mode='text'
                      loading={isSaving}
                      onPress={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      mode='text'
                      loading={isSaving}
                      onPress={handleDeletePopUp}
                    >
                      Delete
                    </Button>
                    <Button mode='text' loading={isSaving} onPress={signOut}>
                      Sign Out
                    </Button>
                    <Button
                      mode='text'
                      loading={isSaving}
                      onPress={() => goBack()}
                    >
                      Dismiss
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      disabled={!isValid}
                      mode='text'
                      loading={isSaving}
                      onPress={handleSubmit}
                    >
                      Submit
                    </Button>
                    <Button mode='text' loading={isSaving} onPress={signOut}>
                      Sign Out
                    </Button>
                    {isVendorSetup && (
                      <Button mode='text' onPress={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    )}
                  </>
                )}
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </DismissKeyboard>
  )
}

export default VendorProfile
