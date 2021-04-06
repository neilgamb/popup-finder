import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { Headline, Title, List, useTheme } from 'react-native-paper'
import { Formik } from 'formik'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_PLACES_API_KEY } from '@env'

import {
  ScreenHeader,
  TextInput,
  Button,
  DismissKeyboard,
} from '../../components'
import { useAuth } from '../../hooks/useAuth'

const VendorHome = () => {
  const { presets, spacing, colors } = useTheme()
  const { userInfo } = useAuth()

  const [locationQuery, setLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState([])

  const getAddress = (locationQuery: string) => {
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery}&key=${GOOGLE_PLACES_API_KEY}`
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then(({ predictions }) => {
        // console.log('---------')
        console.log(predictions)
        setLocationResults(predictions)
        predictions.forEach((result) => {
          console.log(result.description)
          // console.log(result.address_components[0].long_name)
        })
      })
  }

  //todo: follow this tut for fully custom auto complete — https://medium.com/debugger-off/how-to-use-google-autocomplete-api-s-and-react-native-maps-in-react-native-to-fetch-user-location-20d3f65af48b

  // useEffect(() => {
  //   getAddress()
  // }, [])

  useEffect(() => {
    getAddress(locationQuery)
  }, [locationQuery])

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
        <Formik
          initialValues={{
            name: '',
            location: '',
            // description: '',
            // foodType: '',
          }}
          onSubmit={(values) => console.log(values)}
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
                    }}
                  />
                ))}
                {/* <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    height: 200,
                    marginTop: spacing.md,
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude,
                      longitude,
                      latitudeDelta,
                      longitudeDelta,
                    }}
                  />
                </View> */}
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
