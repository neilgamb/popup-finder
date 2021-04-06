import React from 'react'
import { HelperText } from 'react-native-paper'

const FormInputError = ({ error, touched }) => {
  return error && touched ? <HelperText type='error'>{error}</HelperText> : null
}

export default FormInputError
