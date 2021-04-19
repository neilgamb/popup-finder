import React, { useState, useEffect } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'
import { Headline, Title, List, useTheme } from 'react-native-paper'
import { Formik } from 'formik'
import { GOOGLE_PLACES_API_KEY } from '@env'

import { useAuth } from '../../hooks/useAuth'
import { useVendor } from '../../hooks/useVendor'
import {
  ScreenHeader,
  TextInput,
  Button,
  DismissKeyboard,
  FormInputError,
} from '../../components'

import { INIT_POP_VALUES, POP_UP_SCHEMA } from '../../utils/constants'

const VendorHome = () => {
  const { presets, spacing } = useTheme()
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

  const handleLocationSearch = (locationQuery: string) => {
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery}&key=${GOOGLE_PLACES_API_KEY}`
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then(({ predictions }) => setLocationResults(predictions))
  }

  const handleAddPopUp = async (values) => {
    try {
      setIsSaving(true)
      await addPopUp(values, userInfo?.uid)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditPopUp = async (values) => {
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
    //   await deletePopUp(userInfo?.uid, activePopUp.popUpUid)
    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   setIsSaving(false)
    // }
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
                      title={activePopUp.name}
                      description='Pop Up Name'
                      left={(props) => (
                        <List.Icon {...props} icon='hamburger' />
                      )}
                      style={{ marginTop: spacing.md }}
                    />
                    <List.Item
                      title={activePopUp.location}
                      description='Location'
                      left={(props) => (
                        <List.Icon {...props} icon='map-marker' />
                      )}
                    />
                    <List.Item
                      title={activePopUp.foodType}
                      description='Food Type'
                      left={(props) => <List.Icon {...props} icon='earth' />}
                    />
                    <List.Item
                      title={activePopUp.description}
                      description='Description'
                      left={(props) => <List.Icon {...props} icon='note' />}
                    />
                    <List.Item
                      title='Menu'
                      left={(props) => (
                        <List.Icon {...props} icon='format-list-bulleted' />
                      )}
                    />
                  </>
                ) : (
                  <>
                    {!isVendorSetup && (
                      <>
                        <Headline>
                          Welcome, {userInfo?.displayName.split(' ')[0]}
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
                    {locationResults?.map((result, i) => (
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
                  </>
                )}
              </ScrollView>
              <View style={presets.screenActions}>
                {isVendorSetup && !isEditing ? (
                  <>
                    <Button
                      // disabled={!isValid}
                      // disabled={!(isValid && dirty)}
                      mode='text'
                      loading={isSaving}
                      onPress={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      // disabled={!isValid}
                      // disabled={!(isValid && dirty)}
                      mode='text'
                      loading={isSaving}
                      onPress={handleDeletePopUp}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      // disabled={!(isValid && dirty)}
                      disabled={!isValid}
                      mode='text'
                      loading={isSaving}
                      onPress={handleSubmit}
                    >
                      Submit
                    </Button>
                    {isVendorSetup && (
                      <Button
                        mode='text'
                        // disabled={!isValid}
                        // disabled={!(isValid && dirty)}
                        // loading={isSaving}
                        onPress={() => setIsEditing(false)}
                      >
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

export default VendorHome
