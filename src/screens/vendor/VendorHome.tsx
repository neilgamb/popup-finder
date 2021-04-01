import React, { createRef } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput as Input,
} from 'react-native'
import { Headline, Title, useTheme } from 'react-native-paper'
import { Formik } from 'formik'
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
  const locationRef = createRef()

  //todo: follow this tut for fully custom auto complete — https://medium.com/debugger-off/how-to-use-google-autocomplete-api-s-and-react-native-maps-in-react-native-to-fetch-user-location-20d3f65af48b

  return (
    <DismissKeyboard>
      <SafeAreaView style={presets.screenContainer}>
        <Formik
          initialValues={{
            name: '',
            location: '',
            description: '',
            foodType: '',
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
                <View>
                  <TextInput
                    label='Pop Up Name'
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                  <GooglePlacesAutocomplete
                    // suppressDefaultStyles={true}
                    query={{
                      key: GOOGLE_PLACES_API_KEY,
                      language: 'en', // language of the results
                    }}
                    onPress={(data, details) => console.log(data, details)}
                    styles={{
                      textInputContainer: {
                        marginTop: spacing.sm,
                      },
                      poweredContainer: { height: 0 },
                      powered: { height: 0 },
                      listView: {
                        paddingTop: spacing.xs,
                        // paddingHorizontal: spacing.sm,
                        backgroundColor: 'white',
                        borderRadius: 8,
                      },
                      separator: { height: 0 },
                      description: { color: colors.primary },
                    }}
                    textInputProps={{
                      InputComp: Input,
                      // leftIcon: { type: 'font-awesome', name: 'chevron-left' },
                      // errorStyle: { color: 'red' },
                    }}
                  />
                  {/* <TextInput
                    label='Home City or Town'
                    onChangeText={handleChange('location')}
                    onBlur={handleBlur('location')}
                    value={values.location}
                  /> */}
                  {/* <TextInput
                    label='Description'
                    placeholder='Briefly describe your pop up in a sentence or two'
                    multiline
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  <View
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundColor: 'white',
                      marginTop: spacing.md,
                    }}
                  ></View> */}
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
