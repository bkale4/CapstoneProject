// Import React and the components used to display catering menus
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Catering Menu Options screen
import type {
    CateringMenuOptionsScreenProps,
    CateringMenuScreenProps,
} from "../types";

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

// Displays the selected Drop-Off Catering menu, including items, prices, and availablity
export const CateringMenuScreen = ({
  Header,
  selectedCateringMenu,
  expandedDropOffCategories,
  setExpandedDropOffCategories,
}: CateringMenuScreenProps) => (
  <>
    <Header title="Catering Menu" />

    <ScrollView contentContainerStyle={styles.content}>
      {selectedCateringMenu?.type === "dropOffCatering" && (
        <Text style={styles.cateringMenuTitle}>
          {selectedCateringMenu.name}
        </Text>
      )}

      {selectedCateringMenu?.type === "dropOffCatering" &&
        selectedCateringMenu.description?.trim() && (
          <Text style={styles.menuDescription}>
            {selectedCateringMenu.description}
          </Text>
        )}

      {selectedCateringMenu?.type === "dropOffCatering" &&
        selectedCateringMenu.categories?.map(
          (category: any, categoryIndex: number) => (
            <View key={categoryIndex}>
              <Pressable
                style={styles.menuDropdownButton}
                onPress={() =>
                  setExpandedDropOffCategories((previous) =>
                    previous.includes(categoryIndex)
                      ? previous.filter((index) => index !== categoryIndex)
                      : [...previous, categoryIndex],
                  )
                }
              >
                <Text style={styles.menuDropdownText}>
                  {category.name}{" "}
                  {expandedDropOffCategories.includes(categoryIndex)
                    ? "▲"
                    : "▼"}
                </Text>
              </Pressable>
              {expandedDropOffCategories.includes(categoryIndex) &&
                category.items?.map((item: any, itemIndex: number) => (
                  <View key={itemIndex} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.menuDescription}>
                      {item.description}
                    </Text>
                    {item.pricingType === "halfFull" ? (
                      <>
                        <Text style={styles.cateringPrice}>
                          Half: ${Number(item.halfPrice).toFixed(2)}
                        </Text>
                        <Text style={styles.cateringPrice}>
                          Full: ${Number(item.fullPrice).toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.cateringPrice}>
                        ${Number(item.price).toFixed(2)}
                      </Text>
                    )}

                    {(item.status === "Limited" ||
                      item.status === "Sold Out") && (
                      <Text
                        style={[
                          styles.statusText,
                          item.status === "Sold Out"
                            ? styles.soldOutText
                            : styles.limitedText,
                        ]}
                      >
                        {item.status}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
          ),
        )}
      <Text style={styles.cateringNote}>
        Contact us with for special requests and dietary restriction requests.
      </Text>
    </ScrollView>
  </>
);
