import React, { useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { List, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { useVendor, MenuItem } from '../../hooks/useVendor'
import { Button, Card } from '../../components'
import { theme } from '../../style/theme'

import { ScrollView } from 'react-native-gesture-handler'

const VendorProfileMenu = () => {
  const { spacing, colors } = useTheme()
  const { navigate } = useNavigation()
  const { menuItems, deleteMenuItem } = useVendor()

  const handleDeleteMenuItem = async (menuItem: MenuItem) => {
    try {
      await deleteMenuItem(menuItem.menuItemUid)
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const categories = [...new Set(menuItems.map((x) => x.category))]

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
        {categories.map((category) => {
          return (
            <Card
              style={{ marginTop: spacing.md, paddingVertical: spacing.sm }}
            >
              <List.Item
                title={category.charAt(0).toUpperCase() + category.slice(1)}
                titleStyle={{
                  fontSize: 18,
                  fontWeight: '600',
                }}
              />
              {menuItems.map((menuItem, i) => {
                if (menuItem.category === category) {
                  return (
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
                            <List.Icon
                              {...props}
                              icon='pencil'
                              style={{ margin: 0 }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteMenuItem(menuItem)}
                          >
                            <List.Icon
                              {...props}
                              icon='delete'
                              style={{ margin: 0 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  )
                }
              })}
            </Card>
          )
        })}
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
