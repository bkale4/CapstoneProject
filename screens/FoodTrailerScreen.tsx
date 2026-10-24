// Imports React and the components needed to display the Food Trailer menu and handle customer interactions
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Imports the application's screen navigation type

// Immports the application's shared styling
import { styles } from "../styles/styles";

import { FoodTrailerScreenProps } from "../types";

// Displays the active Food Trailer menu using data from Firestore.
// Receives category controls, add-on selections, and cart functionality from the main application
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
        {/* categories without a parent */}
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
