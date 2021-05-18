import * as Yup from 'yup'

export const INIT_POP_VALUES = __DEV__
  ? {
      // name: "Tom's",
      // location: 'New Orleans, LA',
      // foodType: 'Sushi',
      // description: 'its also good',
      name: '',
      location: '',
      locationData: {},
      foodType: '',
      description: '',
    }
  : {
      name: '',
      location: '',
      locationData: {},
      foodType: '',
      description: '',
    }

export const POP_UP_SCHEMA = Yup.object().shape({
  name: Yup.string()
    // .matches(/^[a-zA-z][a-zA-z ]*$/, 'Please do not include special characters')
    .required(),
  location: Yup.string().required('Required'),
  foodType: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
})

export const INIT_MENU_ITEM_VALUES = __DEV__
  ? {
      // name: 'Burger',
      // description: 'Juicy smash burger with all the fixings',
      // price: '1.99',
      // menuItemUid: '',
      // category: 'Appetizers',
      name: '',
      description: '',
      price: '',
      menuItemUid: '',
      category: '',
    }
  : {
      name: '',
      description: '',
      price: '',
      menuItemUid: '',
      category: '',
    }

export const MENU_ITEM_SCHEMA = Yup.object().shape({
  name: Yup.string()
    // .matches(/^[a-zA-z][a-zA-z ]*$/, 'Please do not include special characters')
    .required(),
  description: Yup.string().required('Required'),
  price: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
})

export const MENU_ITEM_CATEGORIES = [
  { label: 'Appetizers', value: 'apps' },
  { label: 'Main Courses', value: 'main' },
  { label: 'Sides', value: 'sides' },
  { label: 'Specials', value: 'specials' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Drinks', value: 'drinks' },
]

export const EVENT_SCHEMA = Yup.object().shape({
  eventDate: Yup.date().required('Required'),
  location: Yup.string().required('Required'),
  menu: Yup.array().required(),
})

export const INIT_EVENT_VALUES = __DEV__
  ? {
      eventDate: '',
      location: '',
      locationData: {},
      menu: [],
    }
  : {
      eventDate: '',
      location: '',
      locationData: {},
      menu: [],
    }
