// Imports React and the components needed to display the Food Trailer menu and handle customer interactions
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Imports the application's shared styling
import { styles } from "../styles/styles";

// Imports the properties required by the Food Trailer screen
import type { FoodTrailerScreenProps } from "../types";

// Displays the Food Trailer menu, including categories, items, add-ons, and cart functionality
export const FoodTrailerScreen = ({
  Header,
  activeFoodTrailerMenu,
  foodTrailerLocation,
  foodTrailerEventName,
  expandedCategories,
  setExpandedCategories,
  expandedParentCategories,
  setExpandedParentCategories,
  selectedAddOns,
  setSelectedAddOns,
  selectedAddOnOptions,
  setSelectedAddOnOptions,
  addToCart,
  setScreen,
  cartTotal,
}: FoodTrailerScreenProps) => {
  // Gets the parent categories used to organize the Food Trailer menu
  const parentCategories: string[] = [
    ...new Set<string>(
      (activeFoodTrailerMenu?.categories || [])
        .map((category: any) => category.parentCategory?.trim() || "")
        .filter((parent: string) => parent !== ""),
    ),
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header title="Food Trailer Menu" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Text style={styles.sectionText}>
          Now Serving: {foodTrailerLocation}
        </Text>
        <Text style={styles.sectionText}>Event: {foodTrailerEventName}</Text>
        {/* Displays expandable parent categories in the Food Trailer menu */}
        {parentCategories.map((parentCategory) => (
          <View key={parentCategory}>
            <Pressable
              style={styles.menuDropdownButton}
              onPress={() =>
                setExpandedParentCategories((previous) =>
                  previous.includes(parentCategory)
                    ? previous.filter((name) => name !== parentCategory)
                    : [...previous, parentCategory],
                )
              }
            >
              <Text style={styles.menuDropdownText}>
                {parentCategory}{" "}
                {expandedParentCategories.includes(parentCategory) ? "▲" : "▼"}
              </Text>
            </Pressable>

            {/* Displays subcategories when a parent category is expanded */}
            {expandedParentCategories.includes(parentCategory) &&
              activeFoodTrailerMenu?.categories?.map(
                (category: any, categoryIndex: number) =>
                  (category.parentCategory?.trim() || "Other") ===
                  parentCategory ? (
                    <View key={categoryIndex}>
                      <Pressable
                        style={styles.subCategoryDropdownButton}
                        onPress={() =>
                          setExpandedCategories((previous) =>
                            previous.includes(categoryIndex)
                              ? previous.filter(
                                  (index) => index != categoryIndex,
                                )
                              : [...previous, categoryIndex],
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.menuDropdownText,
                            { color: "#35543D" },
                          ]}
                        >
                          {category.name}{" "}
                          {expandedCategories.includes(categoryIndex)
                            ? "▲"
                            : "▼"}
                        </Text>
                      </Pressable>

                      {expandedCategories.includes(categoryIndex) &&
                        category.description?.trim() && (
                          <Text style={styles.menuDescription}>
                            {category.description}
                          </Text>
                        )}
                      {/* Displays menu items when a subcategory is expanded */}
                      {expandedCategories.includes(categoryIndex) &&
                        category.items?.map((item: any, itemIndex: number) => (
                          <View key={itemIndex} style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.menuDescription}>
                              {item.description}
                            </Text>
                            <Text style={styles.sectionText}>
                              ${Number(item.price).toFixed(2)}
                            </Text>
                            {/* Displays optional add-ons available for a menu item */}
                            {item.addOn?.name && (
                              <Pressable
                                onPress={() => {
                                  const itemId = `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`;

                                  if (item.addOns?.length > 1) {
                                    setSelectedAddOnOptions((previous) => ({
                                      ...previous,
                                      [itemId]: previous[itemId] === 0 ? -1 : 0,
                                    }));
                                  } else {
                                    setSelectedAddOns((previous) =>
                                      previous.includes(itemId)
                                        ? previous.filter((id) => id !== itemId)
                                        : [...previous, itemId],
                                    );
                                  }
                                }}
                              >
                                <Text
                                  style={[styles.addOnText, { fontSize: 20 }]}
                                >
                                  {item.addOns?.length > 1
                                    ? selectedAddOnOptions[
                                        `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`
                                      ] === 0
                                      ? "☑ "
                                      : "☐ "
                                    : selectedAddOns.includes(
                                          `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`,
                                        )
                                      ? "☑ "
                                      : "☐ "}
                                  {item.addOn.name} (+$
                                  {Number(item.addOn.price).toFixed(2)})
                                </Text>
                              </Pressable>
                            )}

                            {/* Displays additional add-on options for a menu item */}
                            {item.addOns?.length > 1 &&
                              item.addOns
                                .slice(1)
                                .map(
                                  (
                                    addOn: { name: string; price: number },
                                    addOnIndex: number,
                                  ) => {
                                    const itemId = `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`;
                                    const optionIndex = addOnIndex + 1;

                                    return (
                                      <Pressable
                                        key={optionIndex}
                                        onPress={() => {
                                          setSelectedAddOnOptions(
                                            (previous) => ({
                                              ...previous,
                                              [itemId]:
                                                previous[itemId] === optionIndex
                                                  ? -1
                                                  : optionIndex,
                                            }),
                                          );
                                        }}
                                      >
                                        <Text
                                          style={[
                                            styles.addOnText,
                                            { fontSize: 20 },
                                          ]}
                                        >
                                          {selectedAddOnOptions[itemId] ===
                                          optionIndex
                                            ? "☑ "
                                            : "☐ "}
                                          {addOn.name} (+$
                                          {Number(addOn.price).toFixed(2)})
                                        </Text>
                                      </Pressable>
                                    );
                                  },
                                )}

                            {/* Displays Limited or Sold Out status for menu items */}
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
                            {/* Adds the selected item and any add-ons to the cart */}
                            <Pressable
                              style={[
                                styles.adminButton,
                                item.status === "Sold Out" && {
                                  opacity: 0.5,
                                },
                              ]}
                              disabled={item.status === "Sold Out"}
                              onPress={() => {
                                const itemId = `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`;

                                const selectedOptionIndex =
                                  selectedAddOnOptions[itemId];

                                const selectedAddOn =
                                  item.addOns?.length > 1
                                    ? selectedOptionIndex >= 0
                                      ? item.addOns[selectedOptionIndex]
                                      : undefined
                                    : selectedAddOns.includes(itemId)
                                      ? item.addOn
                                      : undefined;

                                const hasAddOn = Boolean(selectedAddOn?.name);

                                const cartId = hasAddOn
                                  ? `${itemId}-addOn-${selectedAddOn.name}`
                                  : itemId;

                                const cartName = hasAddOn
                                  ? `${item.name} + ${selectedAddOn.name}`
                                  : item.name;

                                const finalPrice =
                                  Number(item.price) +
                                  (hasAddOn
                                    ? Number(selectedAddOn?.price ?? 0)
                                    : 0);

                                addToCart(cartId, cartName, finalPrice);

                                setSelectedAddOnOptions((previous) => {
                                  const updated = { ...previous };
                                  delete updated[itemId];
                                  return updated;
                                });
                              }}
                            >
                              <Text style={styles.adminButtonText}>
                                {item.status === "Sold Out"
                                  ? "Sold Out"
                                  : "Add to Cart"}
                              </Text>
                            </Pressable>
                          </View>
                        ))}
                    </View>
                  ) : null,
              )}
          </View>
        ))}
        {/* Displays menu categories that do not have a parent category */}
        {activeFoodTrailerMenu?.categories?.map(
          (category: any, categoryIndex: number) =>
            !category.parentCategory?.trim() ? (
              <View key={categoryIndex}>
                <Pressable
                  style={styles.menuDropdownButton}
                  onPress={() =>
                    setExpandedCategories((previous) =>
                      previous.includes(categoryIndex)
                        ? previous.filter((index) => index !== categoryIndex)
                        : [...previous, categoryIndex],
                    )
                  }
                >
                  <Text style={styles.menuDropdownText}>
                    {category.name}{" "}
                    {expandedCategories.includes(categoryIndex) ? "▲" : "▼"}
                  </Text>
                </Pressable>
                {expandedCategories.includes(categoryIndex) &&
                  category.description?.trim() && (
                    <Text style={styles.menuDescription}>
                      {category.description}
                    </Text>
                  )}

                {expandedCategories.includes(categoryIndex) &&
                  category.items?.map((item: any, itemIndex: number) => (
                    <View key={itemIndex} style={styles.card}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.menuDescription}>
                        {item.description}
                      </Text>
                      <Text style={styles.sectionText}>
                        ${Number(item.price).toFixed(2)}
                      </Text>
                      {/* Displays optional add-ons available for a menu item */}
                      {item.addOn?.name && (
                        <Pressable
                          onPress={() => {
                            const itemId = `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`;

                            if (item.addOns?.length > 1) {
                              setSelectedAddOnOptions((previous) => ({
                                ...previous,
                                [itemId]: previous[itemId] === 0 ? -1 : 0,
                              }));
                            } else {
                              setSelectedAddOns((previous) =>
                                previous.includes(itemId)
                                  ? previous.filter((id) => id !== itemId)
                                  : [...previous, itemId],
                              );
                            }
                          }}
                        >
                          <Text style={[styles.addOnText, { fontSize: 20 }]}>
                            {item.addOns?.length > 1
                              ? selectedAddOnOptions[
                                  `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`
                                ] === 0
                                ? "☑ "
                                : "☐ "
                              : selectedAddOns.includes(
                                    `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`,
                                  )
                                ? "☑ "
                                : "☐ "}
                            {item.addOn.name} (+$
                            {Number(item.addOn.price).toFixed(2)})
                          </Text>
                        </Pressable>
                      )}
                      {/* Displays additional add-on options for a menu item */}
                      {item.addOns?.length > 1 &&
                        item.addOns
                          .slice(1)
                          .map(
                            (
                              addOn: { name: string; price: number },
                              addOnIndex: number,
                            ) => {
                              const itemId = `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`;
                              const optionIndex = addOnIndex + 1;

                              return (
                                <Pressable
                                  key={optionIndex}
                                  onPress={() => {
                                    setSelectedAddOnOptions((previous) => ({
                                      ...previous,
                                      [itemId]:
                                        previous[itemId] === optionIndex
                                          ? -1
                                          : optionIndex,
                                    }));
                                  }}
                                >
                                  <Text
                                    style={[styles.addOnText, { fontSize: 20 }]}
                                  >
                                    {selectedAddOnOptions[itemId] ===
                                    optionIndex
                                      ? "☑ "
                                      : "☐ "}
                                    {addOn.name} (+$
                                    {Number(addOn.price).toFixed(2)})
                                  </Text>
                                </Pressable>
                              );
                            },
                          )}
                      {/* Displays Limited or Sold Out status for menu items */}
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
                      {/* Adds the selected item and any add-ons to the cart */}
                      <Pressable
                        style={[
                          styles.adminButton,
                          item.status === "Sold Out" && {
                            opacity: 0.5,
                          },
                        ]}
                        disabled={item.status === "Sold Out"}
                        onPress={() => {
                          const itemId = `${activeFoodTrailerMenu.id}-${categoryIndex}-${itemIndex}`;

                          const selectedOptionIndex =
                            selectedAddOnOptions[itemId];

                          const selectedAddOn =
                            item.addOns?.length > 1
                              ? selectedOptionIndex >= 0
                                ? item.addOns[selectedOptionIndex]
                                : undefined
                              : selectedAddOns.includes(itemId)
                                ? item.addOn
                                : undefined;

                          const hasAddOn = Boolean(selectedAddOn?.name);

                          const cartId = hasAddOn
                            ? `${itemId}-addOn-${selectedAddOn.name}`
                            : itemId;

                          const cartName = hasAddOn
                            ? `${item.name} + ${selectedAddOn.name}`
                            : item.name;

                          const finalPrice =
                            Number(item.price) +
                            (hasAddOn ? Number(selectedAddOn?.price ?? 0) : 0);

                          addToCart(cartId, cartName, finalPrice);

                          setSelectedAddOnOptions((previous) => {
                            const updated = { ...previous };
                            delete updated[itemId];
                            return updated;
                          });
                        }}
                      >
                        <Text style={styles.adminButtonText}>
                          {item.status === "Sold Out"
                            ? "Sold Out"
                            : "Add to Cart"}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
              </View>
            ) : null,
        )}
      </ScrollView>

      {/* Displays the current cart total and a button to open the Cart screen */}
      <View style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cart")}
        >
          <Text style={styles.primaryButtonText}>
            View Cart - ${cartTotal.toFixed(2)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
