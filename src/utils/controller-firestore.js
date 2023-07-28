import firestore from "@react-native-firebase/firestore";

// Function to add a new purchase record to Firestore
const addPurchaseToFirestore = async (
  customerName,
  customerAddress,
  customerPhone,
  orderList
) => {
  try {
    // Reference to the "purchases" collection
    const purchasesRef = firestore().collection("purchases");

    // Generate a unique ID for the order
    const orderId = firestore().collection("purchases").doc().id;

    // Create a new document with the generated orderId
    await purchasesRef.doc(orderId).set({
      orderId: orderId,
      customerName: customerName,
      customerAddress: customerAddress,
      customerPhone: customerPhone,
      orderList: orderList,
      timestamp: firestore.FieldValue.serverTimestamp(), // Store the server timestamp of the purchase
    });

    console.log("Purchase added with ID: ", orderId);
  } catch (error) {
    console.error("Error adding purchase: ", error);
  }
};
