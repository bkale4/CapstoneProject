// Import React and the components used to display catering menus
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

// Imports the shared category expansion functionality
import { useMenuCategories } from "../hooks/useMenuCategories";

import { useStatusGroups } from "../hooks/useStatusGroups";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Catering Menu Options screen
import type {
  AvailabilityCalendarScreenProps,
  CateringConfirmationScreenProps,
  CateringManagementScreenProps,
  CateringRequestScreenProps,
  CateringScreenProps,
  DropOffCateringMenuOptionsScreenProps,
  DropOffCateringMenuScreenProps,
  OnsiteCateringMenuOptionsScreenProps,
  OnsiteCateringMenuScreenProps,
} from "../types";

// Displays the available Drop-Off Catering menus for customers to select
export const DropOffCateringMenuOptionsScreen = ({
  Header,
  dropOffCateringMenus,
  setSelectedCateringMenuId,
  setScreen,
}: DropOffCateringMenuOptionsScreenProps) => (
  <>
    <Header title="Drop-Off Catering Menus" />

    <ScrollView contentContainerStyle={styles.content}>
      {dropOffCateringMenus.map((menu) => (
        <Pressable
          key={menu.id}
          style={styles.menuDropdownButton}
          onPress={() => {
            setSelectedCateringMenuId(menu.id);
            setScreen("cateringMenu");
          }}
        >
          <Text style={styles.menuDropdownText}>{menu.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </>
);

// Displays the selected Drop-Off Catering menu, including items, prices, and availability
export const DropOffCateringMenuScreen = ({
  Header,
  selectedDropOffCateringMenu,
}: DropOffCateringMenuScreenProps) => {
  // Manages expanded parent categories and subcategories
  const {
    expandedCategories,
    expandedParentCategories,
    toggleCategory,
    toggleParentCategory,
  } = useMenuCategories();
  // Gets the parent categories used to organize the Drop-Off Catering menu
  const parentCategories: string[] = [
    ...new Set<string>(
      (selectedDropOffCateringMenu?.categories || [])
        .map((category: any) => category.parentCategory?.trim() || "")
        .filter((parent: string) => parent !== ""),
    ),
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header title="Drop-Off Catering Menu" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        {/* Displays the selected Drop-Off Catering menu name */}
        <Text style={styles.cateringMenuTitle}>
          {selectedDropOffCateringMenu?.name}
        </Text>

        {/* Displays the selected Drop-Off Catering menu description */}
        {selectedDropOffCateringMenu?.description?.trim() && (
          <Text style={styles.menuDescription}>
            {selectedDropOffCateringMenu.description}
          </Text>
        )}

        {/* Displays expandable parent categories in the Drop-Off Catering menu */}
        {parentCategories.map((parentCategory) => (
          <View key={parentCategory}>
            <Pressable
              style={styles.menuDropdownButton}
              onPress={() => toggleParentCategory(parentCategory)}
            >
              <Text style={styles.menuDropdownText}>
                {parentCategory}{" "}
                {expandedParentCategories.includes(parentCategory) ? "▲" : "▼"}
              </Text>
            </Pressable>

            {/* Displays subcategories when a parent category is expanded */}
            {expandedParentCategories.includes(parentCategory) &&
              selectedDropOffCateringMenu?.categories?.map(
                (category: any, categoryIndex: number) =>
                  (category.parentCategory?.trim() || "Other") ===
                  parentCategory ? (
                    <View key={categoryIndex}>
                      <Pressable
                        style={styles.subCategoryDropdownButton}
                        onPress={() => toggleCategory(categoryIndex)}
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
                            {/* Displays half/full tray or individual item pricing */}
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
                                {item.price === null ||
                                item.price === undefined ||
                                item.price === ""
                                  ? "Contact for Pricing"
                                  : `$${Number(item.price).toFixed(2)}`}
                              </Text>
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
                          </View>
                        ))}
                    </View>
                  ) : null,
              )}
          </View>
        ))}
        {/* Displays menu categories that do not have a parent category */}
        {selectedDropOffCateringMenu?.categories?.map(
          (category: any, categoryIndex: number) =>
            !category.parentCategory?.trim() ? (
              <View key={categoryIndex}>
                <Pressable
                  style={styles.menuDropdownButton}
                  onPress={() => toggleCategory(categoryIndex)}
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
                      {/* Displays half/full tray or individual item pricing */}
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
                          {item.price === null ||
                          item.price === undefined ||
                          item.price === ""
                            ? "Contact for Pricing"
                            : `$${Number(item.price).toFixed(2)}`}
                        </Text>
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
                    </View>
                  ))}
              </View>
            ) : null,
        )}
        {/* Displays the catering information note */}
        <Text style={styles.cateringNote}>
          Contact us with special requests and dietary restriction requests.
        </Text>
      </ScrollView>
    </View>
  );
};

// Displays the Catering Services screen and its available service options
export const CateringScreen = ({ Header, setScreen }: CateringScreenProps) => (
  <>
    <Header title="Catering Services" />

    <ScrollView contentContainerStyle={styles.content}>
      <Pressable
        style={styles.card}
        onPress={() => {
          setScreen("cateringMenuOptions");
        }}
      >
        <Text style={styles.cardTitle}>Drop-Off Catering</Text>

        <Text style={styles.cardSubtitle}>
          Explore catering menu options for meals prepared and delivered without
          onsite event service.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => setScreen("onsiteEventMenuOptions")}
      >
        <Text style={styles.cardTitle}>Onsite Event Catering</Text>
        <Text style={styles.cardSubtitle}>
          Explore catering options for events with food service, including
          plated dinners, buffets, and stations.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => setScreen("availabilityCalendar")}
      >
        <Text style={styles.cardTitle}>Availability Calendar</Text>
        <Text style={styles.cardSubtitle}>
          View available and unavailable dates for catering.
        </Text>
      </Pressable>
    </ScrollView>
  </>
);

// Imports the properties required by the Catering screens
export const CateringRequestScreen = ({
  Header,
  selectedCateringDate,
  formatCateringDate,
  cateringCustomerName,
  setCateringCustomerName,
  cateringTime,
  setCateringTime,
  cateringGuestCount,
  setCateringGuestCount,
  cateringMenuPreferences,
  setCateringMenuPreferences,
  cateringContact,
  setCateringContact,
  cateringVenueName,
  setCateringVenueName,
  cateringVenueAddress,
  setCateringVenueAddress,
  cateringNotes,
  setCateringNotes,
  submitCateringRequest,
}: CateringRequestScreenProps) => (
  <>
    <Header title="Catering Request Form" />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.input}>
        <Text style={styles.selectedDateText}>
          Preferred Date: {formatCateringDate(selectedCateringDate)}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        placeholderTextColor="#555"
        value={cateringCustomerName}
        onChangeText={setCateringCustomerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Preferred Time"
        placeholderTextColor="#555"
        value={cateringTime}
        onChangeText={setCateringTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Estimated Guest Count"
        placeholderTextColor="#555"
        value={cateringGuestCount}
        onChangeText={setCateringGuestCount}
      />
      <TextInput
        style={styles.input}
        placeholder="Menu Preferences"
        placeholderTextColor="#555"
        value={cateringMenuPreferences}
        onChangeText={setCateringMenuPreferences}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#555"
        value={cateringContact}
        onChangeText={setCateringContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Venue Name"
        placeholderTextColor="#555"
        value={cateringVenueName}
        onChangeText={setCateringVenueName}
      />
      <TextInput
        style={styles.input}
        placeholder="Venue Address"
        placeholderTextColor="#555"
        value={cateringVenueAddress}
        onChangeText={setCateringVenueAddress}
      />
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Special Notes"
        placeholderTextColor="#555"
        value={cateringNotes}
        onChangeText={setCateringNotes}
        multiline
      />

      <Pressable style={styles.primaryButton} onPress={submitCateringRequest}>
        <Text style={styles.primaryButtonText}>Submit Catering Request</Text>
      </Pressable>
    </ScrollView>
  </>
);

// Displays the Catering Confirmation screen after a request is submitted
export const CateringConfirmationScreen = ({
  Header,
  setScreen,
}: CateringConfirmationScreenProps) => (
  <>
    <Header title="Request Submitted" />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Thank You!</Text>
        <Text style={styles.summaryLine}>
          Your catering request has been submitted successfully.
        </Text>
        <Text style={styles.summaryLine}>
          A member of Root & Ranch Catering will review your request.
        </Text>
        <Text style={styles.summaryLine}>Status: Pending approval</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => setScreen("home")}>
        <Text style={styles.primaryButtonText}>Return Home</Text>
      </Pressable>
    </ScrollView>
  </>
);

// Displays catering requests and their details for the admin
export const CateringManagementScreen = ({
  Header,
  BusinessBackButton,
  cateringRequests,
  updateCateringRequestStatus,
  updateCateringFollowUp,
}: CateringManagementScreenProps) => {
  // Manages expandable catering request status groups
  const { expandedGroups, toggleGroup } = useStatusGroups(["pending"]);

  // Stores follow-up notes being edited for each catering request
  const [followUpNotes, setFollowUpNotes] = useState<Record<string, string>>(
    {},
  );

  // Tracks which catering request follow-up controls are being edited
  const [editingFollowUpId, setEditingFollowUpId] = useState<string | null>(
    null,
  );

  // Tracks whether each catering request requires follow-up
  const [followUpNeeded, setFollowUpNeeded] = useState<Record<string, boolean>>(
    {},
  );

  // Defines the catering request groups and their display order
  const requestGroups = [
    { status: "pending", title: "Pending Requests" },
    { status: "accepted", title: "Accepted Requests" },
    { status: "rejected", title: "Rejected Requests" },
  ];

  return (
    <>
      <Header title="Catering Requests" />
      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />
        {/* Displays actual customer catering requests from Firestore */}
        {cateringRequests.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>
              No catering requests have been submitted.
            </Text>
          </View>
        ) : (
          requestGroups.map((group) => {
            // Finds requests belonging to the current status group
            const groupRequests = cateringRequests.filter(
              (request) => request.status === group.status,
            );

            const isExpanded = expandedGroups.includes(group.status);

            return (
              <View key={group.status}>
                {/* Displays the expandable status group heading */}
                <Pressable
                  style={styles.card}
                  onPress={() => toggleGroup(group.status)}
                >
                  <Text style={styles.cardTitle}>
                    {group.title} ({groupRequests.length}){" "}
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {/* Displays requests only when the group is expanded */}
                {isExpanded &&
                  groupRequests.map((request) => (
                    <View key={request.id} style={styles.card}>
                      <Text style={styles.cardTitle}>
                        {request.customerName}
                      </Text>

                      <Text style={styles.cardTitle}>
                        Contact: {request.contactInformation}
                      </Text>

                      <Text style={styles.cardTitle}>Date: {request.date}</Text>

                      <Text style={styles.cardTitle}>Time: {request.time}</Text>

                      <Text style={styles.cardTitle}>
                        Guests: {request.guestCount}
                      </Text>

                      <Text style={styles.cardTitle}>
                        Menu Preference: {request.menuPreferences}
                      </Text>

                      <Text style={styles.cardTitle}>
                        Venue: {request.venueName}
                      </Text>

                      <Text style={styles.cardTitle}>
                        Venue Address: {request.venueAddress}
                      </Text>

                      <Text style={styles.cardTitle}>
                        Special Notes: {request.specialNotes}
                      </Text>

                      <Text style={styles.cardTitle}>
                        Status: {request.status}
                      </Text>

                      {/* Displays whether the catering request requires follow-up */}
                      <Text style={styles.cardSubtitle}>
                        Follow-Up:{" "}
                        {request.followUpNeeded ? "Needed" : "Not Needed"}
                      </Text>

                      {/* Displays saved follow-up notes */}
                      {!!request.followUpNotes && (
                        <Text style={styles.cardSubtitle}>
                          Follow-Up Notes: {request.followUpNotes}
                        </Text>
                      )}

                      {/* Opens the follow-up editor for the selected request */}
                      <Pressable
                        style={styles.adminButton}
                        onPress={() => {
                          setFollowUpNotes((prev) => ({
                            ...prev,
                            [request.id]: request.followUpNotes || "",
                          }));

                          setFollowUpNotes((prev) => ({
                            ...prev,
                            [request.id]: request.followUpNotes === true,
                          }));

                          setEditingFollowUpId(request.id);
                        }}
                      >
                        <Text style={styles.adminButtonText}>
                          Manage Follow-Up
                        </Text>
                      </Pressable>

                      {/* Displays the follow-up editor for the selected request */}
                      {editingFollowUpId === request.id && (
                        <View style={{ marginTop: 10 }}>
                          {/* Allows the admin to change follow-up status */}
                          <Pressable
                            style={styles.secondaryButton}
                            onPress={() =>
                              setFollowUpNeeded((prev) => ({
                                ...prev,
                                [request.id]: !prev[request.id],
                              }))
                            }
                          >
                            <Text style={styles.secondaryButtonText}>
                              Follow Up Needed:{" "}
                              {followUpNeeded[request.id] ? "Yes" : "No"}
                            </Text>
                          </Pressable>

                          {/* Allows the admin to enter follow-up notes */}
                          <TextInput
                            style={styles.input}
                            placeholder="Enter follow-up notes"
                            multiline
                            value={followUpNotes[request.id] || ""}
                            onChangeText={(text) =>
                              setFollowUpNotes((prev) => ({
                                ...prev,
                                [request.id]: text,
                              }))
                            }
                          />

                          {/* Saves follow-up information to Firestore */}
                          <Pressable
                            style={styles.primaryButton}
                            onPress={async () => {
                              // Saves follow-up changes and closes the editor only if saving succeeds
                              try {
                                await updateCateringFollowUp(
                                  request.id,
                                  followUpNeeded[request.id] ?? false,
                                  followUpNotes[request.id] || "",
                                );
                                setEditingFollowUpId(null);
                              } catch (error) {
                                console.error(
                                  "Unable to save follow-up changes:",
                                  error,
                                );
                              }
                            }}
                          >
                            <Text style={styles.primaryButtonText}>
                              Save Follow-Up
                            </Text>
                          </Pressable>

                          {/* Closes the editor without saving */}
                          <Pressable
                            style={styles.secondaryButton}
                            onPress={() => setEditingFollowUpId(null)}
                          >
                            <Text style={styles.secondaryButtonText}>
                              Cancel
                            </Text>
                          </Pressable>
                        </View>
                      )}

                      {/* Allows admin to accept or reject pending requests */}
                      {request.status === "pending" && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 15,
                          }}
                        >
                          <Pressable
                            style={[styles.primaryButton, { flex: 1 }]}
                            onPress={() =>
                              updateCateringRequestStatus(
                                request.id,
                                "accepted",
                              )
                            }
                          >
                            <Text style={styles.primaryButtonText}>Accept</Text>
                          </Pressable>

                          <Pressable
                            style={[styles.secondaryButton, { flex: 1 }]}
                            onPress={() =>
                              updateCateringRequestStatus(
                                request.id,
                                "rejected",
                              )
                            }
                          >
                            <Text style={styles.primaryButtonText}>Reject</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  ))}

                {/* Displays a message when an expanded group is empty */}
                {isExpanded && groupRequests.length === 0 && (
                  <View style={styles.card}>
                    <Text style={styles.cardSubtitle}>
                      No {group.status} catering requests.
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

// Displays the available Onsite Event Catering menus for customers to select
export const OnsiteCateringMenuOptionsScreen = ({
  Header,
  onsiteCateringMenus,
  setSelectedCateringMenuId,
  setScreen,
}: OnsiteCateringMenuOptionsScreenProps) => (
  <>
    <Header title="Onsite Event Catering Menus" />

    <ScrollView contentContainerStyle={styles.content}>
      {onsiteCateringMenus.map((menu) => (
        <Pressable
          key={menu.id}
          style={styles.menuDropdownButton}
          onPress={() => {
            setSelectedCateringMenuId(menu.id);
            setScreen("onsiteEventCatering");
          }}
        >
          <Text style={styles.menuDropdownText}>{menu.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </>
);

// Displays the selected Onsite Event Catering menu, including items, prices, and availability
export const OnsiteCateringMenuScreen = ({
  Header,
  selectedOnsiteCateringMenu,
}: OnsiteCateringMenuScreenProps) => {
  // Manages expanded parent categories and subcategories
  const {
    expandedCategories,
    expandedParentCategories,
    toggleCategory,
    toggleParentCategory,
  } = useMenuCategories();
  // Gets the parent categories used to organize the Onsit Event Catering menu
  const parentCategories: string[] = [
    ...new Set<string>(
      (selectedOnsiteCateringMenu?.categories || [])
        .map((category: any) => category.parentCategory?.trim() || "")
        .filter((parent: string) => parent !== ""),
    ),
  ];

  return (
    <View style={{ flex: 1 }}>
      <Header title="Onsite Catering Menu" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        {/* Displays the selected Drop-Off Catering menu name */}
        <Text style={styles.cateringMenuTitle}>
          {selectedOnsiteCateringMenu?.name}
        </Text>

        {/* Displays the selected Drop-Off Catering menu description */}
        {selectedOnsiteCateringMenu?.description?.trim() && (
          <Text style={styles.menuDescription}>
            {selectedOnsiteCateringMenu.description}
          </Text>
        )}

        {/* Displays expandable parent categories in the Drop-Off Catering menu */}
        {parentCategories.map((parentCategory) => (
          <View key={parentCategory}>
            <Pressable
              style={styles.menuDropdownButton}
              onPress={() => toggleParentCategory(parentCategory)}
            >
              <Text style={styles.menuDropdownText}>
                {parentCategory}{" "}
                {expandedParentCategories.includes(parentCategory) ? "▲" : "▼"}
              </Text>
            </Pressable>

            {/* Displays subcategories when a parent category is expanded */}
            {expandedParentCategories.includes(parentCategory) &&
              selectedOnsiteCateringMenu?.categories?.map(
                (category: any, categoryIndex: number) =>
                  (category.parentCategory?.trim() || "Other") ===
                  parentCategory ? (
                    <View key={categoryIndex}>
                      <Pressable
                        style={styles.subCategoryDropdownButton}
                        onPress={() => toggleCategory(categoryIndex)}
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
                            {/* Displays half/full tray or individual item pricing */}
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
                                {item.price === null ||
                                item.price === undefined ||
                                item.price === ""
                                  ? "Contact for Pricing"
                                  : `$${Number(item.price).toFixed(2)}`}
                              </Text>
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
                          </View>
                        ))}
                    </View>
                  ) : null,
              )}
          </View>
        ))}
        {/* Displays menu categories that do not have a parent category */}
        {selectedOnsiteCateringMenu?.categories?.map(
          (category: any, categoryIndex: number) =>
            !category.parentCategory?.trim() ? (
              <View key={categoryIndex}>
                <Pressable
                  style={styles.menuDropdownButton}
                  onPress={() => toggleCategory(categoryIndex)}
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
                      {/* Displays half/full tray or individual item pricing */}
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
                          {item.price === null ||
                          item.price === undefined ||
                          item.price === ""
                            ? "Contact for Pricing"
                            : `$${Number(item.price).toFixed(2)}`}
                        </Text>
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
                    </View>
                  ))}
              </View>
            ) : null,
        )}
        {/* Displays the catering information note */}
        <Text style={styles.cateringNote}>
          Contact us with special requests and dietary restriction requests.
        </Text>
      </ScrollView>
    </View>
  );
};

// Displays the Catering Availability Calendar and allows customers to select a date
export const AvailabilityCalendarScreen = ({
  Header,
  currentMonth,
  currentYear,
  monthNames,
  goToPreviousMonth,
  goToNextMonth,
  firstDayOfMonth,
  daysInMonth,
  today,
  availability,
  selectedCateringDate,
  setSelectedCateringDate,
  setScreen,
}: AvailabilityCalendarScreenProps) => (
  <>
    <Header title="Catering Availability" />

    <ScrollView contentContainerStyle={styles.content}>
      {/* Displays the current month and calendar navigation buttons */}
      <View style={styles.card}>
        <View style={styles.calendarHeader}>
          <Pressable
            style={styles.calendarNavButton}
            onPress={goToPreviousMonth}
          >
            <Text style={styles.calendarNavText}>‹</Text>
          </Pressable>

          <Text style={styles.cardTitle}>
            {monthNames[currentMonth]} {currentYear}
          </Text>

          <Pressable style={styles.calendarNavButton} onPress={goToNextMonth}>
            <Text style={styles.calendarNavText}>›</Text>
          </Pressable>
        </View>

        <Text style={styles.cardSubtitle}>
          View available dates for catering requests.
        </Text>
      </View>

      {/* Displays the calendar weekdays and date grid */}
      <View style={styles.calendar}>
        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {/* Adds blank cells before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <View key={`blank-${index}`} style={styles.calendarDay} />
          ))}

          {/* Displays each date and its availability status */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;

            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;

            const dateForCell = new Date(currentYear, currentMonth, day);

            const todayAtMidnight = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );

            const isPastDate = dateForCell < todayAtMidnight;

            const isAvailable = !isPastDate && availability[dateKey] !== false;

            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <Pressable
                key={dateKey}
                disabled={!isAvailable}
                onPress={() => setSelectedCateringDate(dateKey)}
                style={[
                  styles.calendarDay,
                  isAvailable ? styles.availableDay : styles.unavailableDay,
                  isToday && styles.todayDay,
                  selectedCateringDate === dateKey && styles.selectedDay,
                ]}
              >
                <Text style={styles.calendarDayNumber}>{day}</Text>

                <Text style={styles.calendarStatus}>
                  {isAvailable ? "Available" : "Unavailable"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Explains the available and unavailable date statuses */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Legend</Text>

        <Text style={styles.cardSubtitle}>
          Available = open for catering requests
        </Text>

        <Text style={styles.cardSubtitle}>
          Unavailable = already booked or not accepting requests
        </Text>
      </View>

      {/* Opens the Catering Request form after a date is selected */}
      <Pressable
        style={[
          styles.primaryButton,
          !selectedCateringDate && styles.disabledButton,
        ]}
        disabled={!selectedCateringDate}
        onPress={() => setScreen("cateringRequest")}
      >
        <Text style={styles.primaryButtonText}>Continue to Request Form</Text>
      </Pressable>
    </ScrollView>
  </>
);
