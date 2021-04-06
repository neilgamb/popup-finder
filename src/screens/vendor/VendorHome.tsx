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
} from '../../components'

import { INIT_POP_VALUES, POP_UP_SCHEMA } from '../../utils/constants'

const VendorHome = () => {
  const { presets, spacing, colors } = useTheme()
  const { navigate } = useNavigation()
  const { userInfo } = useAuth()
  const { addPopUp } = useVendor()

  const [locationQuery, setLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState([])
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
      await addPopUp(values)
      // navigate('VendorEvents')
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
                <Headline>
                  Welcome, {userInfo?.displayName.split(' ')[0]}
                </Headline>
                <Title style={{ marginTop: spacing.sm }}>
                  Before you get started, tell us a little more about your pop
                  up...
                </Title>
                <TextInput
                  label='Pop Up Name'
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <HelperText type='error' visible={errors.name && touched.name}>
                  {touched.name && errors.name}
                </HelperText>
                <TextInput
                  label='Location'
                  onChangeText={(text) => {
                    setLocationQuery(text)
                    setValues({ ...values, location: text })
                  }}
                  onBlur={handleBlur('location')}
                  value={values.location}
                />
                <HelperText
                  type='error'
                  visible={errors.location && touched.location}
                >
                  {touched.location && errors.location}
                </HelperText>
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

                <HelperText
                  type='error'
                  visible={errors.foodType && touched.foodType}
                >
                  {touched.foodType && errors.foodType}
                </HelperText>
                <TextInput
                  label='Description'
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
                <HelperText
                  type='error'
                  visible={errors.description && touched.description}
                >
                  {touched.description && errors.description}
                </HelperText>
              </ScrollView>
              <View style={presets.screenActions}>
                <Button
                  disabled={!isValid}
                  // disabled={!(isValid && dirty)}
                  loading={isSaving}
                  onPress={handleSubmit}
                >
                  Submit
                </Button>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </DismissKeyboard>
  )
}

export default VendorHome
