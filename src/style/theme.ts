import { StyleSheet } from 'react-native'

export const withBorder = {
  borderWidth: 1,
  borderColor: 'black',
}

export const presets = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  screenActions: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    // ...withBorder,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 30,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    marginRight: 5,
  },
})
