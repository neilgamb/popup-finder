import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { Headline, Title, useTheme } from 'react-native-paper'
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

  // temp
  const [latitude, setLatitude] = useState(12.840575)
  const [longitude, setLongitude] = useState(77.651787)
  const [latitudeDelta, setLatitudeDelta] = useState(0.025)
  const [longitudeDelta, setLongitudeDelta] = useState(0.025)

  const getAddress = () => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`
    fetch(url)
      .then((response) => response.json())
      .then((json) => console.log(JSON.stringify(json)))
  }

  //todo: follow this tut for fully custom auto complete — https://medium.com/debugger-off/how-to-use-google-autocomplete-api-s-and-react-native-maps-in-react-native-to-fetch-user-location-20d3f65af48b

  useEffect(() => {
    getAddress()
  }, [])

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
          {({ handleChange, handleBlur, handleSubmit, values }) => (
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
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                  value={values.location}
                />
                <View
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
                </View>
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
