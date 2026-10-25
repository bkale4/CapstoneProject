// Imports React and the components used for administrative menu management
import React from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Menu Management screen
import type { AddMenuScreenProps, MenuManagementScreenProps } from "../types";

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

// Displays the Add Menu form and allows administrators to create menus
export const AddMenuScreen = ({
  Header,
  setScreen,
  newMenuName,
  setNewMenuName,
  newMenuDescription,
  setNewMenuDescription,
  newMenuType,
  setNewMenuType,
  menuTypeDropdown,
  setMenuTypeDropdown,
  newMenuLocation,
  setNewMenuLocation,
  newMenuEventName,
  setNewMenuEventName,
  newMenuActive,
  setNewMenuActive,
  addNewMenu,
}: AddMenuScreenProps) => (
  <>
    <Header title="Add Menu" />

    <ScrollView contentContainerStyle={styles.content}>
      {/* Returns to the Menu Management screen */}
      <Pressable
        style={styles.backButton}
        onPress={() => setScreen("menuManagement")}
      >
        <Text style={styles.backButtonText}>🡄 Back</Text>
      </Pressable>

      {/* Collects the menu name and description */}
      <Text style={styles.label}>Menu Name</Text>
      <TextInput
        style={styles.input}
        value={newMenuName}
        onChangeText={setNewMenuName}
        placeholder="Enter menu name"
      />

      <Text style={styles.label}>Menu Description</Text>
      <TextInput
        style={styles.input}
        value={newMenuDescription}
        onChangeText={setNewMenuDescription}
        placeholder="Enter menu description"
        multiline
      />

      {/* Allows administrators to select the menu type */}
      <Text style={styles.label}>Menu Type</Text>
      <Pressable
        style={styles.dropdown}
        onPress={() => setMenuTypeDropdown(!menuTypeDropdown)}
      >
        <Text style={styles.dropdownText}>
          {newMenuType === "foodTrailer"
            ? "Food Trailer"
            : newMenuType === "dropOffCatering"
              ? "Drop-Off Catering"
              : newMenuType === "onsiteEventCatering"
                ? "Onsite Event Catering"
                : "Select menu type"}
        </Text>

        <Text style={styles.dropdownArrow}>{menuTypeDropdown ? "▲" : "▼"}</Text>
      </Pressable>

      {menuTypeDropdown && (
        <View style={styles.dropdownOptions}>
          {["Food Trailer", "Drop-Off Catering", "Onsite Event Catering"].map(
            (type) => (
              <Pressable
                key={type}
                style={styles.dropdownOption}
                onPress={() => {
                  setNewMenuType(
                    type === "Food Trailer"
                      ? "foodTrailer"
                      : type === "Drop-Off Catering"
                        ? "dropOffCatering"
                        : "onsiteEventCatering",
                  );
                  setMenuTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{type}</Text>
              </Pressable>
            ),
          )}
        </View>
      )}

      {/* Collects the menu location and event name */}
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={newMenuLocation}
        onChangeText={setNewMenuLocation}
        placeholder="Enter location"
      />

      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        value={newMenuEventName}
        onChangeText={setNewMenuEventName}
        placeholder="Enter event name"
      />

      {/* Sets the menu's active or inactive status */}
      <Pressable
        style={styles.adminButton}
        onPress={() => setNewMenuActive(!newMenuActive)}
      >
        <Text style={styles.adminButtonText}>
          Status: {newMenuActive ? "Active" : "Inactive"}
        </Text>
      </Pressable>

      {/* Saves the new menu using the existing menu creation function */}
      <Pressable style={styles.adminButton} onPress={addNewMenu}>
        <Text style={styles.adminButtonText}>Add Menu</Text>
      </Pressable>
    </ScrollView>
  </>
);
