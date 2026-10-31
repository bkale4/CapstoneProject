// Imports tools for testing Firestore security rules
const { initializeTestEnvironment } = require("@firebase/rules-unit-testing");
const { readFileSync } = require("fs");
const { test } = require("node:test");
const assert = require("node:assert/strict");

// Tests Firestore rules against the locally running emulator
test("Unauthenticated users cannot modify menus", async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: "rootranchcatering",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });

  try {
    // Clears previous test documents so each run starts with an empty database
    await testEnv.clearFirestore();
    // Creates a Firestore client without signing in
    const db = testEnv.unauthenticatedContext().firestore();
    // Simulates a signed-in administrator using Firebase Authentication
    const adminDb = testEnv.authenticatedContext("test-admin").firestore();
    const { doc, setDoc, getDoc } = require("firebase/firestore");

    // Verifies that creating a menu without administrator access is rejected
    await assert.rejects(
      setDoc(doc(db, "menus", "security-test-menu"), {
        name: "Security Test Menu",
      }),
      (error) => error.code === "permission-denied",
    );

    // Creates a test administrator profile in the local Firestore Emulator
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const setupDb = context.firestore();

      await setDoc(doc(setupDb, "users", "test-admin"), {
        role: "admin",
      });
    });

    // Tests whether an authenticated administrator can create a menu
    await assert.doesNotReject(
      setDoc(doc(adminDb, "menus", "admin-test-menu"), {
        name: "Administrator Test Menu",
      }),
    );

    // Simulates a signed-in customer
    const customerDb = testEnv
      .authenticatedContext("test-customer")
      .firestore();

    // Verifies that customers cannot create an administrator account
    await assert.rejects(
      setDoc(doc(customerDb, "users", "test-customer"), {
        name: "Test Customer",
        phone: "5551234567",
        email: "customer@example.com",
        role: "admin",
      }),
      (error) => error.code === "permission-denied",
    );

    // Verifies that customers can create their own account with the customer role
    await assert.doesNotReject(
      setDoc(doc(customerDb, "users", "test-customer"), {
        name: "Test Customer",
        phone: "5551234567",
        email: "customer@example.com",
        role: "customer",
      }),
    );

    // Verifies that customers can submit orders without signing in
    await assert.doesNotReject(
      setDoc(doc(db, "orders", "test-customer-order"), {
        customerName: "Test Customer",
        phone: "5551234567",
        email: "customer@example.com",
        menuType: "Food Trailer",
        location: "Test Location",
        eventName: "Test Event",
        items: [],
        total: 25,
        paymentMethod: "Cash",
        paymentStatus: "Not Paid",
        status: "Open",
        createdAt: new Date(),
      }),
    );

    // Verifies that Venmo orders can be created with Pending Payment status
    await assert.doesNotReject(
      setDoc(doc(db, "orders", "test-venmo-order"), {
        customerName: "Test Customer",
        phone: "5551234567",
        email: "customer@example.com",
        menuType: "Food Trailer",
        location: "Test Location",
        eventName: "Test Event",
        items: [],
        total: 25,
        paymentMethod: "Venmo",
        paymentStatus: "Not Paid",
        status: "Pending Payment",
        createdAt: new Date(),
      }),
    );

    // Verifies that PayPal and Zelle orders can be held pending payment
    for (const paymentMethod of ["PayPal", "Zelle"]) {
      await assert.doesNotReject(
        setDoc(doc(db, "orders", `test-${paymentMethod.toLowerCase()}-order`), {
          customerName: "Test Customer",
          phone: "5551234567",
          email: "customer@example.com",
          menuType: "Food Trailer",
          location: "Test Location",
          eventName: "Test Event",
          items: [],
          total: 25,
          paymentMethod: paymentMethod,
          paymentStatus: "Not Paid",
          status: "Pending Payment",
          createdAt: new Date(),
        }),
      );
    }

    // Verifies that customers cannot create an order already marked as Paid
    await assert.rejects(
      setDoc(doc(db, "orders", "test-unverified-payment"), {
        customerName: "Test Customer",
        phone: "5551234567",
        email: "customer@example.com",
        menuType: "Food Trailer",
        location: "Test Location",
        eventName: "Test Event",
        items: [],
        total: 25,
        paymentMethod: "Venmo",
        paymentStatus: "Paid",
        status: "Open",
        createdAt: new Date(),
      }),
      (error) => error.code === "permission-denied",
    );

    // Verifies that customers can submit catering requests without signing in
    await assert.doesNotReject(
      setDoc(doc(db, "cateringRequests", "test-catering-request"), {
        customerName: "Test Customer",
        contactInformation: "customer@example.com",
        date: "2026-11-15",
        time: "12:00 PM",
        guestCount: 50,
        menuPreferences: "Buffet",
        venueName: "Test Venue",
        venueAddress: "123 Test Street",
        specialNotes: "No special requests",
        status: "pending",
        createdAt: new Date(),
      }),
    );

    // Verifies that users who aren't signed in cannot view customer orders
    await assert.rejects(
      getDoc(doc(db, "orders", "test-customer-order")),
      (error) => error.code === "permission-denied",
    );

    // Verifies that users who aren't signed in cannot view catering requests
    await assert.rejects(
      getDoc(doc(db, "cateringRequests", "test-catering-request")),
      (error) => error.code === "permission-denied",
    );

    // Verifies that administrators can view customer orders
    await assert.doesNotReject(
      getDoc(doc(adminDb, "orders", "test-customer-order")),
    );

    // Verifies that administrators can view customer catering requests
    await assert.doesNotReject(
      getDoc(doc(adminDb, "cateringRequests", "test-catering-request")),
    );

    // Imports the Firestore function used to update existing documents
    const { updateDoc } = require("firebase/firestore");

    // Verifies that administrators can mark customer orders as Filled
    await assert.doesNotReject(
      updateDoc(doc(adminDb, "orders", "test-customer-order"), {
        status: "Filled",
      }),
    );

    // Verifies that administrators can cancel customer orders
    await assert.doesNotReject(
      updateDoc(doc(adminDb, "orders", "test-customer-order"), {
        status: "Cancelled",
      }),
    );

    // Verifies that customers cannot change an existing order's status
    await assert.rejects(
      updateDoc(doc(db, "orders", "test-customer-order"), {
        status: "Cancelled",
      }),
      (error) => error.code === "permission-denied",
    );

    // Verifies that administrators can update an order's payment status
    await assert.doesNotReject(
      updateDoc(doc(adminDb, "orders", "test-customer-order"), {
        paymentStatus: "Paid",
      }),
    );

    // Verifies that customers cannot change an existing order's payment status
    await assert.rejects(
      updateDoc(doc(db, "orders", "test-customer-order"), {
        paymentStatus: "Paid",
      }),
      (error) => error.code === "permission-denied",
    );

    // Verifies that administrators can update catering request statuses
    await assert.doesNotReject(
      updateDoc(doc(adminDb, "cateringRequests", "test-catering-request"), {
        status: "approved",
      }),
    );

    // Verifies that unauthenticated customers cannot modify catering requests
    await assert.rejects(
      updateDoc(doc(db, "cateringRequests", "test-catering-request"), {
        status: "approved",
      }),
      (error) => error.code === "permission-denied",
    );

    // Simulates a different signed-in customer
    const otherCustomerDb = testEnv
      .authenticatedContext("other-customer")
      .firestore();

    // Verifies that customers cannot read another customer's profile
    await assert.rejects(
      getDoc(doc(otherCustomerDb, "users", "test-customer")),
      (error) => error.code === "permission-denied",
    );

    // Verifies that customers can read their own profiles
    await assert.doesNotReject(
      getDoc(doc(customerDb, "users", "test-customer")),
    );

    // Verifies that customers can view catering availability
    await assert.doesNotReject(getDoc(doc(db, "availability", "test-date")));

    // Verifies that customers can view menu photos
    await assert.doesNotReject(getDoc(doc(db, "menuItemImages", "test-photo")));

    // Verifies that customers can read menus without signing in
    await assert.doesNotReject(getDoc(doc(db, "menus", "security-test-menu")));
  } finally {
    // Cleans up the testing environment
    await testEnv.cleanup();
  }
});
