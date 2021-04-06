import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
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
} from '../../components'

const VendorHome = () => {
  const { presets, spacing, colors } = useTheme()
  const { userInfo } = useAuth()
  const { addPopUp } = useVendor()

  const [locationQuery, setLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState([])

  const handleLocationSearch = (locationQuery: string) => {
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery}&key=${GOOGLE_PLACES_API_KEY}`
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then(({ predictions }) => setLocationResults(predictions))
  }

  useEffect(() => {
    handleLocationSearch(locationQuery)
  }, [locationQuery])

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
        <Formik
          initialValues={{
            name: '',
            location: '',
            foodType: '',
            description: '',
          }}
          onSubmit={(values) => addPopUp(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, setValues, values }) => (
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
                <TextInput
                  label='Location'
                  onChangeText={(text) => {
                    setLocationQuery(text)
                    setValues({ ...values, location: text })
                  }}
                  onBlur={handleBlur('location')}
                  value={values.location}
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
                <TextInput
                  label='Description'
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
              </ScrollView>
              <View style={presets.screenActions}>
                <Button onPress={handleSubmit}>Submit</Button>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </DismissKeyboard>
  )
}

export default VendorHome
