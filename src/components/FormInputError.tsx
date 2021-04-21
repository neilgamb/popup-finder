import React from 'react'
import { HelperText } from 'react-native-paper'

interface Props {
  error: string
  touched: boolean
}

const FormInputError = ({ error, touched }: Props) => {
  return error && touched ? <HelperText type='error'>{error}</HelperText> : null
}

export default FormInputError
