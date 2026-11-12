// Imports React and the components used for administrative menu management
// Imports React for the order management components
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  compressMenuItemPhoto,
  loadMenuItemPhoto,
  selectMenuItemPhoto,
} from "../services/imageService";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Menu Management screen
import type {
  AddMenuScreenProps,
  EditMenuItemScreenProps,
  EditMenuScreenProps,
  ManageMenuItemsScreenProps,
  MenuManagementScreenProps,
} from "../types/types";

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
          {!!menu.location && (
            <Text style={styles.cardSubtitle}>Location: {menu.location}</Text>
          )}

          {!!menu.eventName && (
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
                `Are you sure you want to delete ${menu.name}? This will also delete all its categories and items.`,
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

// Displays the Edit Menu form and allows administrators to update menu details
export const EditMenuScreen = ({
  Header,
  setScreen,
  editMenuName,
  setEditMenuName,
  editMenuDescription,
  setEditMenuDescription,
  editMenuType,
  setEditMenuType,
  editMenuTypeDropdown,
  setEditMenuTypeDropdown,
  editMenuLocation,
  setEditMenuLocation,
  editMenuEventName,
  setEditMenuEventName,
  saveMenuChanges,
}: EditMenuScreenProps) => (
  <>
    <Header title="Edit Menu" />

    <ScrollView contentContainerStyle={styles.content}>
      {/* Returns to the Menu Management screen */}
      <Pressable
        style={styles.backButton}
        onPress={() => setScreen("menuManagement")}
      >
        <Text style={styles.backButtonText}>🡄 Back</Text>
      </Pressable>

      {/* Allows administrators to edit the menu name and description */}
      <Text style={styles.label}>Menu Name</Text>
      <TextInput
        style={styles.input}
        value={editMenuName}
        onChangeText={setEditMenuName}
        placeholder="Enter menu name"
      />

      <Text style={styles.label}>Menu Description</Text>
      <TextInput
        style={styles.input}
        value={editMenuDescription}
        onChangeText={setEditMenuDescription}
        placeholder="Enter menu description"
        multiline
      />

      {/* Allows administrators to change the menu type */}
      <Text style={styles.label}>Menu Type</Text>
      <Pressable
        style={styles.dropdown}
        onPress={() => setEditMenuTypeDropdown(!editMenuTypeDropdown)}
      >
        <Text style={styles.dropdownText}>
          {editMenuType === "foodTrailer"
            ? "Food Trailer"
            : editMenuType === "dropOffCatering"
              ? "Drop-Off Catering"
              : editMenuType === "onsiteEventCatering"
                ? "Onsite Event Catering"
                : "No menu type selected"}
        </Text>

        <Text style={styles.dropdownArrow}>
          {editMenuTypeDropdown ? "▲" : "▼"}
        </Text>
      </Pressable>

      {/* Displays the available menu types */}
      {editMenuTypeDropdown && (
        <View style={styles.dropdownOptions}>
          {["Food Trailer", "Drop-Off Catering", "Onsite Event Catering"].map(
            (type) => (
              <Pressable
                key={type}
                style={styles.dropdownOption}
                onPress={() => {
                  setEditMenuType(
                    type === "Food Trailer"
                      ? "foodTrailer"
                      : type === "Drop-Off Catering"
                        ? "dropOffCatering"
                        : "onsiteEventCatering",
                  );
                  setEditMenuTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{type}</Text>
              </Pressable>
            ),
          )}
        </View>
      )}

      {/* Allows administrators to edit the menu location and event name */}
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={editMenuLocation}
        onChangeText={setEditMenuLocation}
        placeholder="Enter location"
      />

      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        value={editMenuEventName}
        onChangeText={setEditMenuEventName}
        placeholder="Enter event name"
      />

      {/* Saves the updated menu information */}
      <Pressable style={styles.adminButton} onPress={saveMenuChanges}>
        <Text style={styles.adminButtonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  </>
);

// Loads and displays a menu item's saved photo from Firestore
export const SavedMenuItemPhoto = ({ photoId }: { photoId?: string }) => {
  // Stores the image URI retrieved from Firestore
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    // Prevents an old photo from appearing when the item changes
    let active = true;
    setPhotoUri(null);

    // Skips loading when the item does not have a photo ID
    if (!photoId) {
      return () => {
        active = false;
      };
    }

    // Retrieves the photo associated with this menu item
    loadMenuItemPhoto(photoId)
      .then((uri) => {
        if (active) {
          setPhotoUri(uri);
        }
      })
      .catch((error) => {
        console.error("Error loading menu item photo:", error);
      });

    return () => {
      active = false;
    };
  }, [photoId]);

  // Hides the image component when no photo exists
  if (!photoUri) {
    return null;
  }

  return (
    <View style={styles.menuItemImageContainer}>
      <Image source={{ uri: photoUri }} style={styles.menuItemImage} />
    </View>
  );
};

// Displays and manages menu categories, items, pricing, and add-ons
export const ManageMenuItemsScreen = ({
  Header,
  manageMenuScrollRef,
  setShowBackToTop,
  showBackToTop,
  setScreen,
  selectedAdminMenu,
  isEditingMenuDescription,
  editMenuDescription,
  setEditMenuDescription,
  saveMenuDescription,
  setIsEditingMenuDescription,
  newCategoryName,
  setNewCategoryName,
  newCategoryDescription,
  setNewCategoryDescription,
  newCategoryParent,
  setNewCategoryParent,
  addNewCategory,
  getAdminMenuItemGroups,
  editingCategoryIndex,
  setEditingCategoryIndex,
  editCategoryName,
  setEditCategoryName,
  editCategoryDescription,
  setEditCategoryDescription,
  editCategoryParent,
  setEditCategoryParent,
  saveCategoryChanges,
  deleteMenuCategory,
  newItemCategoryIndex,
  setNewItemCategoryIndex,
  newItemName,
  setNewItemName,
  newItemPhoto,
  setNewItemPhoto,
  editItemPhoto,
  setEditItemPhoto,
  newItemDescription,
  setNewItemDescription,
  newItemPricingType,
  setNewItemPricingType,
  newItemPrice,
  setNewItemPrice,
  newItemHalfPrice,
  setNewItemHalfPrice,
  newItemFullPrice,
  setNewItemFullPrice,
  newAddOnName,
  setNewAddOnName,
  newAddOnPrice,
  setNewAddOnPrice,
  additionalAddOns,
  setAdditionalAddOns,
  addNewMenuItem,
  setSelectedAdminItem,
  setSelectedAdminItemGroup,
  setSelectedAdminItemIndex,
  setEditItemName,
  setEditItemDescription,
  setEditItemPrice,
  setEditItemPricingType,
  setEditItemHalfPrice,
  setEditItemFullPrice,
  setEditItemStatus,
  setEditItemAddOnName,
  setEditItemAddOnPrice,
  deleteMenuItem,
}: ManageMenuItemsScreenProps) => (
  <>
    <Header title="Manage Menu Items" />

    <ScrollView
      ref={manageMenuScrollRef}
      contentContainerStyle={styles.content}
      onScroll={(event) => {
        setShowBackToTop(event.nativeEvent.contentOffset.y > 20);
      }}
      scrollEventThrottle={16}
    >
      {/* Returns to the Menu Management screen */}
      <Pressable
        style={styles.backButton}
        onPress={() => setScreen("menuManagement")}
      >
        <Text style={styles.backButtonText}>🡄 Back</Text>
      </Pressable>

      <Text style={styles.cardTitle}>{selectedAdminMenu?.name}</Text>

      {/* Displays and allows editing of the menu description */}
      <Text style={styles.label}>Menu Description</Text>

      {isEditingMenuDescription ? (
        <>
          <TextInput
            style={styles.input}
            value={editMenuDescription}
            onChangeText={setEditMenuDescription}
            placeholder="Enter menu description"
            multiline
          />

          <Pressable
            style={styles.adminButton}
            onPress={() => saveMenuDescription()}
          >
            <Text style={styles.adminButtonText}>Save Description</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.menuDescription}>
            {selectedAdminMenu?.description || "No description added."}
          </Text>

          <Pressable
            style={styles.adminButton}
            onPress={() => setIsEditingMenuDescription(true)}
          >
            <Text style={styles.adminButtonText}>Edit Menu Description</Text>
          </Pressable>
        </>
      )}

      <Text style={styles.cardSubtitle}>
        Add, edit, price, and remove menu items.
      </Text>

      {/* Collects information for a new menu category */}
      <Text style={styles.label}>New Category</Text>

      <TextInput
        style={styles.input}
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        placeholder="Enter category name"
      />

      <TextInput
        style={styles.input}
        value={newCategoryDescription}
        onChangeText={setNewCategoryDescription}
        placeholder="Enter category description (optional)"
        multiline
      />

      <Text style={styles.label}>Parent Category</Text>
      <TextInput
        style={styles.input}
        value={newCategoryParent}
        onChangeText={setNewCategoryParent}
        placeholder="Enter parent category (e.g., Breakfast or Lunch)"
      />

      <Pressable style={styles.adminButton} onPress={addNewCategory}>
        <Text style={styles.adminButtonText}>Add Category</Text>
      </Pressable>

      {/* Displays existing categories and their management options */}
      {getAdminMenuItemGroups(selectedAdminMenu).map((group: any) => (
        <View key={group.field}>
          <Text style={styles.menuSectionTitle}>{group.name}</Text>

          {/* Displays the category's parent when available */}
          {group.field.startsWith("categories.") &&
          selectedAdminMenu?.categories?.[Number(group.field.split(".")[1])]
            ?.parentCategory ? (
            <Text style={[styles.cardSubtitle, { textAlign: "center" }]}>
              Parent Category:{" "}
              {
                selectedAdminMenu.categories[Number(group.field.split(".")[1])]
                  .parentCategory
              }
            </Text>
          ) : null}

          {/* Loads the selected category into the editing form */}
          {group.field.startsWith("categories.") && (
            <Pressable
              style={styles.adminButton}
              onPress={() => {
                const categoryIndex = Number(group.field.split(".")[1]);
                const category = selectedAdminMenu?.categories?.[categoryIndex];

                setEditingCategoryIndex(categoryIndex);
                setEditCategoryName(category?.name || "");
                setEditCategoryDescription(category?.description || "");
                setEditCategoryParent(category?.parentCategory || "");
              }}
            >
              <Text style={styles.adminButtonText}>Edit Category</Text>
            </Pressable>
          )}

          {/* Displays the form for editing a selected category */}
          {group.field.startsWith("categories.") &&
            editingCategoryIndex === Number(group.field.split(".")[1]) && (
              <View style={styles.card}>
                <Text style={styles.label}>Category Name</Text>
                <TextInput
                  style={styles.input}
                  value={editCategoryName}
                  onChangeText={setEditCategoryName}
                  placeholder="Category Name"
                />

                <Text style={styles.label}>Category Description</Text>
                <TextInput
                  style={styles.input}
                  value={editCategoryDescription}
                  onChangeText={setEditCategoryDescription}
                  placeholder="Category description (optional)"
                  multiline
                />

                <Text style={styles.label}>Parent Category</Text>
                <TextInput
                  style={styles.input}
                  value={editCategoryParent}
                  onChangeText={setEditCategoryParent}
                  placeholder="Enter parent category (e.g., Breakfast or Lunch"
                />

                <Pressable
                  style={styles.adminButton}
                  onPress={() => saveCategoryChanges()}
                >
                  <Text style={styles.adminButtonText}>Save Changes</Text>
                </Pressable>
              </View>
            )}

          {/* Confirms before deleting a category */}
          {group.field.startsWith("categories.") && (
            <Pressable
              style={styles.adminButton}
              onPress={() => {
                const categoryIndex = Number(group.field.split(".")[1]);

                if (Platform.OS === "web") {
                  const confirmed = window.confirm(
                    `Are you sure you want to delete ${group.name}?`,
                  );

                  if (confirmed) {
                    deleteMenuCategory(categoryIndex);
                  }

                  return;
                }

                Alert.alert(
                  "Delete Menu Item",
                  `Are you sure you want to delete ${group.name}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteMenuCategory(categoryIndex),
                    },
                  ],
                );
              }}
            >
              <Text style={styles.adminButtonText}>Delete Category</Text>
            </Pressable>
          )}

          {/* Displays the form for adding a new item to a category */}
          {group.field.startsWith("categories.") && (
            <View style={styles.card}>
              <Text style={styles.label}>Add Item to {group.name}</Text>

              <TextInput
                style={styles.input}
                value={
                  newItemCategoryIndex === Number(group.field.split(".")[1])
                    ? newItemName
                    : ""
                }
                onChangeText={(text) => {
                  setNewItemCategoryIndex(Number(group.field.split(".")[1]));
                  setNewItemName(text);
                }}
                placeholder="Item name"
              />

              {newItemCategoryIndex === Number(group.field.split(".")[1]) && (
                <>
                  <TextInput
                    style={styles.input}
                    value={newItemDescription}
                    onChangeText={setNewItemDescription}
                    placeholder="Description"
                  />

                  {/* Allows the admin to select a photo for the new menu item */}
                  <Text style={styles.label}>Item Photo (Optional)</Text>

                  <Pressable
                    style={styles.adminButton}
                    onPress={async () => {
                      const selectedPhoto = await selectMenuItemPhoto();

                      // Updates the preview when a photo is selected
                      if (selectedPhoto) {
                        setNewItemPhoto(selectedPhoto);

                        // Tests image compression without saving to Firestore
                        await compressMenuItemPhoto(selectedPhoto);
                      }
                    }}
                  >
                    <Text style={styles.adminButtonText}>
                      {newItemPhoto ? "Change Photo" : "Upload Photo"}
                    </Text>
                  </Pressable>

                  {/* Displays a preview of the selected photo */}
                  {newItemPhoto && (
                    <View style={{ marginTop: 10 }}>
                      <Image
                        source={{ uri: newItemPhoto }}
                        style={styles.menuItemImage}
                        resizeMode="cover"
                      />

                      {/* Removes the selected photo before saving */}
                      <Pressable
                        style={styles.secondaryButton}
                        onPress={() => setNewItemPhoto(null)}
                      >
                        <Text style={styles.secondaryButtonText}>
                          Remove Photo
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {/* Allows selection of single or half/full pricing */}
                  <Text style={styles.label}>Pricing Type</Text>
                  <Pressable
                    style={styles.adminButton}
                    onPress={() =>
                      setNewItemPricingType(
                        newItemPricingType === "single" ? "halfFull" : "single",
                      )
                    }
                  >
                    <Text style={styles.adminButtonText}>
                      {newItemPricingType === "single"
                        ? "Single Price (Tap for Half/Full"
                        : "Half/Full Pricing (Tap for Single)"}
                    </Text>
                  </Pressable>

                  {newItemPricingType === "single" ? (
                    <TextInput
                      style={styles.input}
                      value={newItemPrice}
                      onChangeText={setNewItemPrice}
                      placeholder="Price"
                      keyboardType="decimal-pad"
                    />
                  ) : (
                    <>
                      <TextInput
                        style={styles.input}
                        value={newItemHalfPrice}
                        onChangeText={setNewItemHalfPrice}
                        placeholder="Half Price"
                        keyboardType="decimal-pad"
                      />

                      <TextInput
                        style={styles.input}
                        value={newItemFullPrice}
                        onChangeText={setNewItemFullPrice}
                        placeholder="Full Price"
                        keyboardType="decimal-pad"
                      />
                    </>
                  )}

                  {/* Collects optional add-on information */}
                  <Text style={styles.label}>Optional Add-on</Text>

                  <TextInput
                    style={styles.input}
                    value={newAddOnName}
                    onChangeText={setNewAddOnName}
                    placeholder="Add-on name (e.g., Bacon or Sausage)"
                  />

                  <TextInput
                    style={styles.input}
                    value={newAddOnPrice}
                    onChangeText={setNewAddOnPrice}
                    placeholder="Add-on price"
                    keyboardType="decimal-pad"
                  />

                  {/* Allows multiple add-ons for a menu item */}
                  <Pressable
                    style={styles.adminButton}
                    onPress={() =>
                      setAdditionalAddOns((previous) => [
                        ...previous,
                        { name: "", price: "" },
                      ])
                    }
                  >
                    <Text style={styles.adminButtonText}>
                      Add Another Add-on
                    </Text>
                  </Pressable>

                  {additionalAddOns.map((addOn, index) => (
                    <View key={index}>
                      <TextInput
                        style={styles.input}
                        value={addOn.name}
                        onChangeText={(text) =>
                          setAdditionalAddOns((previous) =>
                            previous.map((option, optionIndex) =>
                              optionIndex === index
                                ? { ...option, name: text }
                                : option,
                            ),
                          )
                        }
                        placeholder={`Additional add-on ${index + 1} name`}
                      />

                      <TextInput
                        style={styles.input}
                        value={addOn.price}
                        onChangeText={(text) =>
                          setAdditionalAddOns((previous) =>
                            previous.map((option, optionIndex) =>
                              optionIndex === index
                                ? { ...option, price: text }
                                : option,
                            ),
                          )
                        }
                        placeholder="Additional add-on price"
                        keyboardType="decimal-pad"
                      />
                    </View>
                  ))}

                  {/* Saves the new item to the selected category */}
                  <Pressable
                    style={styles.adminButton}
                    onPress={addNewMenuItem}
                  >
                    <Text style={styles.adminButtonText}>Add Item</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {/* Displays existing menu items and their details */}
          {group.items.length === 0 ? (
            <Text style={styles.cardSubtitle}>
              No items have been added yet.
            </Text>
          ) : (
            group.items.map((item: any, index: number) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>

                {item.description && (
                  <Text style={styles.cardSubtitle}>{item.description}</Text>
                )}

                {/* Displays the item's saved photo from Firestore */}
                <SavedMenuItemPhoto photoId={item.id} />

                {/* Displays item pricing */}
                {item.pricingType === "halfFull" ? (
                  <>
                    <Text style={styles.cardSubtitle}>
                      Half: ${Number(item.halfPrice).toFixed(2)}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Full: ${Number(item.fullPrice).toFixed(2)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.cardSubtitle}>
                    {item.price === null ||
                    item.price === undefined ||
                    item.price === ""
                      ? "Contact for Pricing"
                      : `$${Number(item.price).toFixed(2)}`}
                  </Text>
                )}

                {/* Displays all saved add-ons for the menu item */}
                {(item.addOns?.length
                  ? item.addOns
                  : item.addOn
                    ? [item.addOn]
                    : []
                ).map(
                  (addOn: { name: string; price: number }, index: number) => (
                    <Text key={index} style={styles.cardSubtitle}>
                      Add-on: {addOn.name} (+${Number(addOn.price).toFixed(2)})
                    </Text>
                  ),
                )}

                <Text style={styles.cardSubtitle}>Status: {item.status}</Text>

                {/* Loads the selected item into the Edit Item screen */}
                <Pressable
                  style={styles.adminButton}
                  onPress={async () => {
                    setSelectedAdminItem(item);
                    setSelectedAdminItemGroup(group.field);
                    setSelectedAdminItemIndex(index);

                    // Clears the previous photo while loading the selected item's saved photo
                    setEditItemPhoto(null);

                    // Loads the existing photo so the admin can preview or replace it
                    if (item.id) {
                      // Waits for the saved photo before opening the Edit Item screen
                      const photoUri = await loadMenuItemPhoto(item.id);
                      setEditItemPhoto(photoUri);
                    }

                    setEditItemName(item.name || "");
                    setEditItemDescription(item.description || "");
                    setEditItemPrice(item.price ?? "");
                    setEditItemPricingType(item.pricingType || "single");
                    setEditItemHalfPrice(
                      item.halfPrice != null ? String(item.halfPrice) : "",
                    );
                    setEditItemFullPrice(
                      item.fullPrice != null ? String(item.fullPrice) : "",
                    );
                    setEditItemStatus(item.status || "");
                    setEditItemAddOnName(item.addOn?.name || "");
                    setEditItemAddOnPrice(
                      item.addOn?.price != null ? String(item.addOn.price) : "",
                    );

                    // Loads the item's additional saved add-ons into the existing add-on state
                    setAdditionalAddOns(
                      (item.addOns || [])
                        .slice(1)
                        .map((addOn: { name: string; price: number }) => ({
                          name: addOn.name,
                          price: String(addOn.price),
                        })),
                    );

                    setScreen("editMenuItem");
                  }}
                >
                  <Text style={styles.adminButtonText}>Edit Item</Text>
                </Pressable>

                {/* Confirms before deleting a menu item */}
                <Pressable
                  style={styles.adminButton}
                  onPress={() => {
                    if (Platform.OS === "web") {
                      const confirmed = window.confirm(
                        `Are you sure you want to delete ${item.name}?`,
                      );

                      if (confirmed) {
                        deleteMenuItem(group.field, index);
                      }

                      return;
                    }

                    Alert.alert(
                      "Delete Menu Item",
                      `Are you sure you want to delete ${item.name}?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteMenuItem(group.field, index),
                        },
                      ],
                    );
                  }}
                >
                  <Text style={styles.adminButtonText}>Delete Item</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      ))}
    </ScrollView>

    {/* Returns to the top of the menu management page */}
    {showBackToTop && (
      <Pressable
        style={styles.backToTopButton}
        onPress={() =>
          manageMenuScrollRef.current?.scrollTo({
            y: 0,
            animated: true,
          })
        }
      >
        <Text style={styles.backToTopButtonText}>↑ Back to Top</Text>
      </Pressable>
    )}
  </>
);

// Displays the form for editing an existing menu item
export const EditMenuItemScreen = ({
  Header,
  setScreen,
  editItemName,
  setEditItemName,
  editItemPhoto,
  setEditItemPhoto,
  editItemDescription,
  setEditItemDescription,
  editItemPricingType,
  setEditItemPricingType,
  editItemPrice,
  setEditItemPrice,
  editItemHalfPrice,
  setEditItemHalfPrice,
  editItemFullPrice,
  setEditItemFullPrice,
  editItemAddOnName,
  setEditItemAddOnName,
  editItemAddOnPrice,
  setEditItemAddOnPrice,
  additionalAddOns,
  setAdditionalAddOns,
  editItemStatus,
  setEditItemStatus,
  itemStatusDropdown,
  setItemStatusDropdown,
  saveMenuItemChanges,
}: EditMenuItemScreenProps) => (
  <>
    <Header title="Edit Menu Item" />

    <ScrollView contentContainerStyle={styles.content}>
      {/* Returns to the Manage Menu Items screen */}
      <Pressable
        style={styles.backButton}
        onPress={() => setScreen("manageMenuItems")}
      >
        <Text style={styles.backButtonText}>🡄 Back</Text>
      </Pressable>

      {/* Allows the client to edit the item's name */}
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={editItemName}
        onChangeText={setEditItemName}
        placeholder="Enter item name"
      />

      {/* Allows the client to edit the item's description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={editItemDescription}
        onChangeText={setEditItemDescription}
        placeholder="Enter description"
      />

      {/* Allows the admin to select a photo for the new menu item */}
      <Text style={styles.label}>Item Photo (Optional)</Text>

      <Pressable
        style={styles.adminButton}
        onPress={async () => {
          const selectedPhoto = await selectMenuItemPhoto();

          // Updates the preview when a photo is selected
          if (selectedPhoto) {
            setEditItemPhoto(selectedPhoto);
          }
        }}
      >
        <Text style={styles.adminButtonText}>
          {editItemPhoto ? "Change Photo" : "Upload Photo"}
        </Text>
      </Pressable>

      {/* Displays a preview of the selected photo */}
      {editItemPhoto && (
        <View style={{ marginTop: 10 }}>
          <Image source={{ uri: editItemPhoto }} style={styles.menuItemImage} />

          {/* Removes the selected photo before saving */}
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setEditItemPhoto(null)}
          >
            <Text style={styles.secondaryButtonText}>Remove Photo</Text>
          </Pressable>
        </View>
      )}

      {/* Allows switching between single and half/full pricing */}
      <Text style={styles.label}>Pricing Type</Text>
      <Pressable
        style={styles.adminButton}
        onPress={() =>
          setEditItemPricingType(
            editItemPricingType === "single" ? "halfFull" : "single",
          )
        }
      >
        <Text style={styles.adminButtonText}>
          {editItemPricingType === "single"
            ? "Single Price (Tap for Half/Full)"
            : "Half/Full Pricing (Tap for Single)"}
        </Text>
      </Pressable>

      {/* Displays price fields based on the selected pricing type */}
      {editItemPricingType === "single" ? (
        <>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={editItemPrice}
            onChangeText={setEditItemPrice}
            placeholder="Enter price"
            keyboardType="decimal-pad"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Half Price</Text>
          <TextInput
            style={styles.input}
            value={editItemHalfPrice}
            onChangeText={setEditItemHalfPrice}
            placeholder="Enter half price"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Full Price</Text>
          <TextInput
            style={styles.input}
            value={editItemFullPrice}
            onChangeText={setEditItemFullPrice}
            placeholder="Enter full price"
            keyboardType="decimal-pad"
          />
        </>
      )}

      {/* Allows editing of an optional add-on and its price */}
      <Text style={styles.label}>Optional Add-on</Text>
      <TextInput
        style={styles.input}
        value={editItemAddOnName}
        onChangeText={setEditItemAddOnName}
        placeholder="Add-on name"
      />

      <TextInput
        style={styles.input}
        value={editItemAddOnPrice}
        onChangeText={setEditItemAddOnPrice}
        placeholder="Add-on price"
        keyboardType="decimal-pad"
      />

      {/* Allows multiple add-ons for a menu item */}
      <Pressable
        style={styles.adminButton}
        onPress={() =>
          setAdditionalAddOns((previous) => [
            ...previous,
            { name: "", price: "" },
          ])
        }
      >
        <Text style={styles.adminButtonText}>Add Another Add-on</Text>
      </Pressable>

      {additionalAddOns.map((addOn, index) => (
        <View key={index}>
          <TextInput
            style={styles.input}
            value={addOn.name}
            onChangeText={(text) =>
              setAdditionalAddOns((previous) =>
                previous.map((option, optionIndex) =>
                  optionIndex === index ? { ...option, name: text } : option,
                ),
              )
            }
            placeholder={`Additional add-on ${index + 1} name`}
          />

          <TextInput
            style={styles.input}
            value={addOn.price}
            onChangeText={(text) =>
              setAdditionalAddOns((previous) =>
                previous.map((option, optionIndex) =>
                  optionIndex === index ? { ...option, price: text } : option,
                ),
              )
            }
            placeholder="Additional add-on price"
            keyboardType="decimal-pad"
          />
        </View>
      ))}

      {/* Displays the dropdown for selecting item availability */}
      <Text style={styles.label}>Availability Status</Text>
      <Pressable
        style={styles.dropdown}
        onPress={() => setItemStatusDropdown(!itemStatusDropdown)}
      >
        <Text style={styles.dropdownText}>
          {editItemStatus || "Select availability status"}
        </Text>

        <Text style={styles.dropdownArrow}>
          {itemStatusDropdown ? "▲" : "▼"}
        </Text>
      </Pressable>

      {/* Displays the available item status options */}
      {itemStatusDropdown && (
        <View style={styles.dropdownOptions}>
          {[
            { label: "Available", value: "Available" },
            { label: "Limited", value: "Limited" },
            { label: "Sold Out", value: "Sold Out" },
          ].map((option) => (
            <Pressable
              key={option.value}
              style={styles.dropdownOption}
              onPress={() => {
                setEditItemStatus(option.value);
                setItemStatusDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Saves the updated menu item */}
      <Pressable style={styles.adminButton} onPress={saveMenuItemChanges}>
        <Text style={styles.adminButtonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  </>
);
