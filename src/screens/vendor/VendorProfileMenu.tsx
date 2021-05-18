import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { List, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useVendor, MenuItem } from '../../hooks/useVendor'
import { Text, Button, Card } from '../../components'
import { theme } from '../../style/theme'
import { MENU_ITEM_CATEGORIES } from '../../utils/constants'

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

  const categories = MENU_ITEM_CATEGORIES.map((c) => {
    if (menuItems.some((e) => e.category === c.value)) {
      return c.value
    }
  })

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ marginBottom: 100 }}>
          <Button
            icon='plus'
            onPress={() => navigate('VendorAddMenuItem')}
            style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}
          >
            Add Menu Item
          </Button>
          {categories.map((category, catI) => {
            return (
              category && (
                <Card
                  key={catI}
                  style={{
                    marginTop: spacing.sm,
                    paddingTop: spacing.sm,
                    paddingBottom: spacing.xxs,
                  }}
                >
                  <Text h3 style={{ marginLeft: spacing.sm }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  {menuItems.map((menuItem, mII) => {
                    if (menuItem.category === category) {
                      return (
                        <List.Item
                          key={mII}
                          title={`${menuItem.name} $${menuItem.price}`}
                          description={menuItem.description}
                          style={{ paddingVertical: 0 }}
                          right={(props) => (
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
                                style={{ paddingHorizontal: spacing.xs }}
                                onPress={() =>
                                  navigate('VendorAddMenuItem', {
                                    isEditing: true,
                                    menuItem,
                                  })
                                }
                              >
                                <Icon {...props} size={22} name='edit' />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{ paddingHorizontal: spacing.xs }}
                                onPress={() => handleDeleteMenuItem(menuItem)}
                              >
                                <Icon {...props} size={22} name='delete' />
                              </TouchableOpacity>
                            </View>
                          )}
                        />
                      )
                    }
                  })}
                </Card>
              )
            )
          })}
        </View>
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
