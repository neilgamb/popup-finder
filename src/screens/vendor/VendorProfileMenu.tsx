import React, { useState, useEffect, useRef } from 'react'
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native'
import {
  ActivityIndicator,
  List,
  FAB,
  Text,
  useTheme,
} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import ReanimatedBottomSheet from 'reanimated-bottom-sheet'

import { useVendor, MenuItem } from '../../hooks/useVendor'
import { Button, Card } from '../../components'
import { theme } from '../../style/theme'

import { ScrollView } from 'react-native-gesture-handler'

const VendorProfileMenu = () => {
  const { spacing, colors } = useTheme()
  const { navigate } = useNavigation()
  const { menuItems, deleteMenuItem } = useVendor()
  const [isSaving, setIsSaving] = useState(false)

  const handleDeleteMenuItem = async (menuItem: MenuItem) => {
    try {
      setIsSaving(true)
      await deleteMenuItem(menuItem.menuItemUid)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Button
          icon='plus'
          onPress={() => navigate('VendorAddMenuItem')}
          style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}
        >
          Add Menu Item
        </Button>
        <Card style={{ marginTop: spacing.md }}>
          {menuItems.map((menuItem, i) => (
            <List.Item
              key={i}
              title={`${menuItem.name} $${menuItem.price}`}
              description={menuItem.description}
              right={(props) => (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('VendorAddMenuItem', {
                        isEditing: true,
                        menuItem,
                      })
                    }
                  >
                    <List.Icon {...props} icon='pencil' style={{ margin: 0 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      // borderWidth: 1,
                      borderColor: 'black',
                      justifyContent: 'center',
                      paddingRight: spacing.xs,
                    }}
                    onPress={() => handleDeleteMenuItem(menuItem)}
                  >
                    {isSaving ? (
                      <ActivityIndicator
                        animating
                        size={20}
                        color={colors.gray}
                      />
                    ) : (
                      <List.Icon
                        {...props}
                        icon='delete'
                        style={{ margin: 0 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
          ))}
        </Card>
      </ScrollView>
    </View>
  )
}

export default VendorProfileMenu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.xs,
  },
  addButtonContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
  },
  addButtonText: {
    color: theme.colors.darkGray,
    fontSize: 22,
    textAlign: 'center',
  },
})
