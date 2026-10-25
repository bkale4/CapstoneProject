// Imports React and the components used for administrative menu management
import React from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Menu Management screen
import type { MenuManagementScreenProps } from "../types";

// Displays menus and allows administrators to manage their settings and items
export const MenuManagementScreen = ({
  Header,
  BusinessBackButton,
  adminMenus,
  setScreen,
  toggleMenuActive,
  setSelectedAdminMenu,
  setEditMenuName,
  setEditMenuDescription,
  setEditMenuType,
  setEditMenuLocation,
  setEditMenuEventName,
  setIsEditingMenuDescription,
  deleteMenu,
}: MenuManagementScreenProps) => (
  <>
    <Header title="Menu Management" />

    <ScrollView contentContainerStyle={styles.content}>
      <BusinessBackButton />

      {/* Opens the Add Menu screen */}
      <Pressable
        style={styles.adminButton}
        onPress={() => setScreen("addMenu")}
      >
        <Text style={styles.adminButtonText}>Add Menu</Text>
      </Pressable>

      {/* Displays each menu and its administrative controls */}
      {adminMenus.map((menu: any) => (
        <View key={menu.id} style={styles.card}>
          <Text style={styles.cardTitle}>{menu.name}</Text>

          {/* Displays menu location and event information when available */}
          {menu.location && (
            <Text style={styles.cardSubtitle}>Location: {menu.location}</Text>
          )}

          {menu.eventName && (
            <Text style={styles.cardSubtitle}>Event: {menu.eventName}</Text>
          )}

          <Text style={styles.cardSubtitle}>
            Status: {menu.active ? "Active" : "Inactive"}
          </Text>

          {/* Allows the administrator to activate or deactivate a menu */}
          <Pressable
            style={styles.adminButton}
            onPress={() => toggleMenuActive(menu.id, menu.active)}
          >
            <Text style={styles.adminButtonText}>
              {menu.active ? "Set Inactive" : "Set Active"}
            </Text>
          </Pressable>

          {/* Loads menu information into the Edit Menu screen */}
          <Pressable
            style={styles.adminButton}
            onPress={() => {
              setSelectedAdminMenu(menu);
              setEditMenuName(menu.name || "");
              setEditMenuDescription(menu.description || "");
              setEditMenuType(menu.type || "");
              setEditMenuLocation(menu.location || "");
              setEditMenuEventName(menu.eventName || "");
              setScreen("editMenu");
            }}
          >
            <Text style={styles.adminButtonText}>Edit Menu</Text>
          </Pressable>

          {/* Confirms before deleting a menu and its contents */}
          <Pressable
            style={styles.adminButton}
            onPress={() => {
              if (Platform.OS === "web") {
                const confirmed = window.confirm(
                  `Are you sure you want to delete ${menu.name}?`,
                );

                if (confirmed) {
                  deleteMenu(menu.id);
                }
                return;
              }

              Alert.alert(
                "Delete Menu",
                `Are you sure you want to delete "${menu.name}"? This will also delete all its categories and items.`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteMenu(menu.id),
                  },
                ],
              );
            }}
          >
            <Text style={styles.adminButtonText}>Delete Menu</Text>
          </Pressable>

          {/* Opens the selected menu's category and item management screen */}
          <Pressable
            style={styles.adminButton}
            onPress={() => {
              setSelectedAdminMenu(menu);
              setEditMenuDescription(menu.description || "");
              setIsEditingMenuDescription(false);
              setScreen("manageMenuItems");
            }}
          >
            <Text style={styles.adminButtonText}>Manage Items</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  </>
);
