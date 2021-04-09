import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { Headline, Title, List, HelperText, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
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
  const { presets, spacing, colors } = useTheme()
  const { navigate } = useNavigation()
  const { userInfo } = useAuth()
  const { addPopUp, addPopUpToVender, isVendorSetup, activePopUp } = useVendor()

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
      const popUpUid = await addPopUp(values, userInfo?.uid)
      addPopUpToVender(userInfo?.uid, popUpUid, values)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    handleLocationSearch(locationQuery)
  }, [locationQuery])

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
        <Formik
          initialValues={INIT_POP_VALUES}
          validationSchema={POP_UP_SCHEMA}
          onSubmit={(values) => handleAddPopUp(values)}
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
                    <Headline>
                      Hey, {userInfo?.displayName.split(' ')[0]}
                    </Headline>
                    <Title style={{ marginTop: spacing.lg }}>
                      Here's your Pop Up information:
                    </Title>
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
                  </>
                ) : (
                  <>
                    <Headline>
                      Welcome, {userInfo?.displayName.split(' ')[0]}
                    </Headline>
                    <Title style={{ marginTop: spacing.sm }}>
                      Before you get started, tell us a little more about your
                      pop up...
                    </Title>

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
                    {locationResults?.map((result) => (
                      <List.Item
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
                  <Button
                    disabled={!isValid}
                    // disabled={!(isValid && dirty)}
                    loading={isSaving}
                    onPress={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    disabled={!isValid}
                    // disabled={!(isValid && dirty)}
                    loading={isSaving}
                    onPress={handleSubmit}
                  >
                    Submit
                  </Button>
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
