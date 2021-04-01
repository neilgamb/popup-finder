import React from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { Headline, Title, useTheme } from 'react-native-paper'
import { Formik } from 'formik'

import {
  ScreenHeader,
  TextInput,
  Button,
  DismissKeyboard,
} from '../../components'
import { useAuth } from '../../hooks/useAuth'

const VendorHome = () => {
  const { presets, spacing } = useTheme()
  const { userInfo } = useAuth()

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
                  <TextInput
                    label='Home City or Town'
                    onChangeText={handleChange('location')}
                    onBlur={handleBlur('location')}
                    value={values.location}
                  />
                  <TextInput
                    label='Description'
                    placeholder='Briefly describe your pop up in a sentence or two'
                    multiline
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
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
