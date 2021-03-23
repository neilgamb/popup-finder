import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { VendorHome, VendorEvents } from '../screens'
import { useVendor } from '../hooks/useVendor'

const Tab = createBottomTabNavigator()

function TabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options

  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 48,
              paddingTop: 32,
            }}
          >
            <Text
              style={{ color: isFocused ? '#673ab7' : '#222', fontSize: 18 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default function VendorStack() {
  const { isVendorSetup } = useVendor()

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={isVendorSetup ? 'VendorEvents' : 'VendorHome'}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name='VendorHome' component={VendorHome} />
        <Tab.Screen name='VendorEvents' component={VendorEvents} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
