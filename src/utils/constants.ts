import * as Yup from 'yup'

export const INIT_POP_VALUES = __DEV__
  ? {
      name: "Neil's",
      location: 'New Orleans, LA',
      foodType: 'Sushi',
      description: 'its good',
      // name: '',
      // location: '',
      // foodType: '',
      // description: '',
    }
  : {
      name: '',
      location: '',
      foodType: '',
      description: '',
    }

export const POP_UP_SCHEMA = Yup.object().shape({
  name: Yup.string()
    // .matches(/^[a-zA-z][a-zA-z ]*$/, 'Please do not include special characters')
    .required(),
  location: Yup.string()
    // .matches(/^[a-zA-z][a-zA-z ]*$/, 'Please do not include special characters')
    .required(),
  foodType: Yup.string()
    // .matches(/^[a-zA-z][a-zA-z ]*$/, 'Please do not include special characters')
    .required(),
  description: Yup.string()
    // .matches(/^[a-zA-z][a-zA-z ]*$/, 'Please do not include special characters')
    .required(),
})
