// Import React and the components used to display catering menus
import React from "react";
import { Pressable, ScrollView, Text } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Catering Menu Options screen
import type { CateringMenuOptionsScreenProps } from "../types";

// Displays the available Drop-Off Catering menus for customers to select
export const CateringMenuOptionsScreen = ({
  Header,
  dropOffCateringMenus,
  setSelectedCateringMenuId,
  setExpandedDropOffCategories,
  setScreen,
}: CateringMenuOptionsScreenProps) => (
  <>
    <Header title="Drop-Off Catering Menus" />

    <ScrollView contentContainerStyle={styles.content}>
      {dropOffCateringMenus.map((menu) => (
        <Pressable
          key={menu.id}
          style={styles.menuDropdownButton}
          onPress={() => {
            setSelectedCateringMenuId(menu.id);
            setExpandedDropOffCategories([]);
            setScreen("cateringMenu");
          }}
        >
          <Text style={styles.menuDropdownText}>{menu.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </>
);
