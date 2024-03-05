import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  query,
  runTransaction,
  deleteDoc,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase.service";
import { serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  deleteObject,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { getMetadata } from "firebase/storage";
//import { createStripeCustomer } from "./checkout.service";

const storage = getStorage();

const defaultImageRef = ref(
  storage,
  "gs://projectvic-88bda.appspot.com/foodie.png"
);
let defaultPhotoURL = null;

getDownloadURL(defaultImageRef)
  .then((url) => {
    console.log("Default image URL:", url);
    defaultPhotoURL = url;
  })
  .catch((error) => {
    console.error("Error getting default image URL:", error);
  });

export default defaultPhotoURL;

export const addPurchaseToFirestore = async (
  customerName,
  customerAddress,
  customerPhone,
  restaurant,
  orderList,
  restaurantNote,
  ridersNote,
  deliveryFee
) => {
  try {
    const purchasesRef = collection(db, "purchases");
    const newPurchaseDoc = doc(purchasesRef);
    const newOrderId = newPurchaseDoc.id;

    const purchaseData = {
      customerName: customerName,
      customerAddress: customerAddress,
      customerPhone: customerPhone,
      restaurant: restaurant,
      orderList: orderList,
      orderStatus: "pending",
      kitchenStatus: "pending",
      rider: "",
      deliveryFee: deliveryFee,
      orderId: newOrderId,
      timestamp: serverTimestamp(),
    };
    if (restaurantNote) {
      purchaseData.RestaurantNote = restaurantNote;
    }
    if (ridersNote) {
      purchaseData.RidersNote = ridersNote;
    }

    await setDoc(newPurchaseDoc, purchaseData);
    return newOrderId;
  } catch (error) {
    console.error("Error adding purchase: ", error);
    return null;
  }
};

/*export const saveUserDataToFirestore = async (phoneNumber, userData) => {
  try {
    await setDoc(doc(db, "users", phoneNumber), userData);
    await createStripeCustomer(phoneNumber);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};*/

export const updateAndFetchProfilePicture = async (
  phoneNumber,
  newProfilePictureURL
) => {
  try {
    const userDocRef = doc(db, "users", phoneNumber);
    await updateDoc(userDocRef, {
      profilePicture: newProfilePictureURL,
    });
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.profilePicture;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating and fetching profile picture:", error);
    return null;
  }
};

export const fetchProfilePicture = async (phoneNumber) => {
  try {
    const userDocRef = doc(db, "users", phoneNumber);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.profilePicture;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
};

export const updateAddresses = async (userPhone, home, office) => {
  try {
    const userRef = doc(db, "users", userPhone);
    const updatedFields = {};
    if (home !== null && home !== undefined) {
      updatedFields.homeAddress = home;
    }
    if (office !== null && office !== undefined) {
      updatedFields.officeAddress = office;
    }
    await updateDoc(userRef, updatedFields);
  } catch (error) {
    console.error("Error updating addresses:", error);
  }
};

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export const updateEmail = async (newEmail, phoneNumber) => {
  if (isValidEmail(newEmail)) {
    try {
      const userDocRef = doc(db, "users", phoneNumber);
      await updateDoc(userDocRef, {
        email: newEmail,
      });
      console.log(`Email updated to ${newEmail}`);
      return true;
    } catch (error) {
      console.error("Error updating email:", error);
      return false;
    }
  } else {
    return false;
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const orderDocRef = doc(db, "purchases", orderId);
    await updateDoc(orderDocRef, {
      orderStatus: "Accepted",
      kitchenStatus: "Accepted",
    });
    return true;
  } catch (error) {
    console.error(`Error accepting order ${orderId}:`, error);
    return false;
  }
};

export const rejectOrder = async (orderId) => {
  try {
    const orderDocRef = doc(db, "purchases", orderId);
    await updateDoc(orderDocRef, {
      orderStatus: "Rejected",
      kitchenStatus: "Rejected",
    });
    return true;
  } catch (error) {
    console.error(`Error rejecting order ${orderId}:`, error);
    return false;
  }
};

export const fetchDeliveredOrders = async () => {
  const q = query(
    collection(db, "purchases"),
    where("kitchenStatus", "==", "Delivered")
  );
  const snapshot = await getDocs(q);
  const deliveredOrders = snapshot.docs.map((doc) => doc.data());
  return deliveredOrders;
};

export const createNewMenu = async (restaurantId, newMenuName, mealType) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (!restaurantDoc.exists()) {
      console.error("Restaurant not found");
      return false;
    }

    const currentMenu = restaurantDoc.data().menu || {};
    currentMenu[newMenuName] = {
      mealType: mealType, // Add the mealType field to the new menu
    };

    const updatedCurrentMenu = {
      ...currentMenu,
    };

    await updateDoc(restaurantRef, {
      menu: updatedCurrentMenu,
    });

    console.log(
      "New menu category added to restaurant with ID: ",
      restaurantId
    );
    return true;
  } catch (error) {
    console.error("Error adding menu category: ", error);
    return false;
  }
};

export const addItemToMenu = async (
  restaurantId,
  categoryKey,
  itemName,
  itemNameArray
) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);
    if (!restaurantDoc.exists()) {
      console.error("Restaurant not found");
      return false;
    }
    const currentMenu = restaurantDoc.data().menu || {};
    if (currentMenu.hasOwnProperty(categoryKey)) {
      if (Array.isArray(itemNameArray) && itemNameArray.length === 2) {
        currentMenu[categoryKey][itemName] = itemNameArray;
        await updateDoc(restaurantRef, {
          menu: currentMenu,
        });
        return true;
      } else {
        console.error("Invalid itemNameArray structure");
        return false;
      }
    } else {
      console.error("Invalid category key");
      return false;
    }
  } catch (error) {
    console.error("Error adding item to the menu:", error);
    return false;
  }
};

export const deleteMenuCategory = async (restaurantId, menuCategoryName) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (!restaurantDoc.exists()) {
      console.error("Restaurant not found");
      return false;
    }

    const currentMenu = restaurantDoc.data().menu || {};

    if (currentMenu[menuCategoryName]) {
      delete currentMenu[menuCategoryName];
      await updateDoc(restaurantRef, {
        menu: currentMenu,
      });
      console.log(`Menu category '${menuCategoryName}' deleted`);
      return true;
    } else {
      console.error(`Menu category '${menuCategoryName}' not found`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting menu category: ", error);
    return false;
  }
};

export const deleteItemFromMenu = async (
  restaurantId,
  categoryKey,
  itemName
) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (!restaurantDoc.exists()) {
      console.error("Restaurant not found");
      return false;
    }
    const currentMenu = restaurantDoc.data().menu || {};

    if (currentMenu.hasOwnProperty(categoryKey)) {
      if (currentMenu[categoryKey].hasOwnProperty(itemName)) {
        delete currentMenu[categoryKey][itemName];
        await updateDoc(restaurantRef, {
          menu: currentMenu,
        });
        return true;
      } else {
        console.error(
          `Item '${itemName}' not found in category '${categoryKey}'`
        );
        return false;
      }
    } else {
      console.error(`Invalid category key '${categoryKey}'`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting item from the menu: ", error);
    return false;
  }
};

export const createNewRestaurant = async (
  restaurantName,
  restaurantAddress,
  openingHours,
  closingHours,
  ownerName,
  imagePickerId // Assuming it's the storage URL for the selected photo
) => {
  try {
    const restaurantsRef = collection(db, "restaurants");
    const allRestaurantsSnapshot = await getDocs(restaurantsRef);
    const nextPlaceId = allRestaurantsSnapshot.size + 1;

    return await runTransaction(db, async (transaction) => {
      const newRestaurantDoc = doc(restaurantsRef);
      const newRestaurantId = newRestaurantDoc.id;

      let photoURL = imagePickerId || defaultPhotoURL;

      await transaction.set(newRestaurantDoc, {
        name: restaurantName,
        address: restaurantAddress,
        openingHours: openingHours,
        closingHours: closingHours,
        owner: ownerName,
        photo: photoURL,
        rating: 0,
        userRatingTotal: 0,
        placeId: nextPlaceId,
        menu: {},
        drinksMenu: {},
        proteinMenu: {},
        sidesMenu: {},
        swallowSelection: {},
        restaurantId: newRestaurantId,
        timestamp: serverTimestamp(),
      });

      imagePickerId = null;

      return newRestaurantId;
    });
  } catch (error) {
    console.error("Error adding restaurant: ", error);
    return null;
  }
};

export const deleteRestaurant = async (restaurantId) => {
  const restaurantRef = doc(db, "restaurants", restaurantId);
  const restaurantDoc = await getDoc(restaurantRef);
  try {
    if (restaurantDoc.exists()) {
      const { photo } = restaurantDoc.data();
      if (photo) {
        const photoRef = ref(storage, photo);
        const photoMetadata = await getMetadata(photoRef);
        if (photoMetadata.name === "foodie.png") {
          console.log(
            "Restaurant is using the default photo. Skipping deletion of photo."
          );
        } else {
          await deleteObject(photoRef);
          console.log("Restaurant photo deleted successfully.");
        }
      }
      await deleteDoc(restaurantRef);
      console.log("Restaurant deleted successfully.");
    } else {
      console.log("Restaurant document does not exist.");
    }
  } catch (error) {
    console.error("Error deleting restaurant and associated photo: ", error);
  }
};

export const deleteItemFromArrayInCategory = async (
  restaurantId,
  categoryName,
  itemName
) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (!restaurantDoc.exists()) {
      console.error("Restaurant not found");
      return false;
    }

    const restaurantData = restaurantDoc.data();

    if (restaurantData.hasOwnProperty(categoryName)) {
      if (typeof restaurantData[categoryName] === "object") {
        if (Array.isArray(restaurantData[categoryName][itemName])) {
          delete restaurantData[categoryName][itemName];

          await updateDoc(restaurantRef, {
            [categoryName]: restaurantData[categoryName],
          });
          return true;
        } else {
          console.error(`Item '${itemName}' is not an array`);
          return false;
        }
      } else {
        console.error(`Category '${categoryName}' is not an object`);
        return false;
      }
    } else {
      console.error(`Invalid category key '${categoryName}'`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting item from the category: ", error);
    return false;
  }
};

export const addNewItemToArrayInCategory = async (
  restaurantId,
  categoryName,
  itemName,
  itemArray
) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (!restaurantDoc.exists()) {
      console.error("Restaurant not found");
      return false;
    }
    const restaurantData = restaurantDoc.data();

    if (restaurantData.hasOwnProperty(categoryName)) {
      if (typeof restaurantData[categoryName] === "object") {
        if (!Array.isArray(restaurantData[categoryName][itemName])) {
          // Ensure the item doesn't already exist as an array
          restaurantData[categoryName][itemName] = itemArray;

          await updateDoc(restaurantRef, {
            [categoryName]: restaurantData[categoryName],
          });
          return true;
        } else {
          console.error(`Item '${itemName}' already exists as an array`);
          return false;
        }
      } else {
        console.error(`Category '${categoryName}' is not an object`);
        return false;
      }
    } else {
      console.error(`Invalid category key '${categoryName}'`);
      return false;
    }
  } catch (error) {
    console.error("Error adding item to the category: ", error);
    return false;
  }
};

export const updateAndFetchRiderPicture = async (
  phoneNumber,
  newProfilePictureURL
) => {
  try {
    const riderDocRef = doc(db, "riders", phoneNumber);
    await updateDoc(userDocRef, {
      profilePictureRider: newProfilePictureURL,
    });
    const docSnap = await getDoc(riderDocRef);

    if (docSnap.exists()) {
      const riderData = docSnap.data();
      return riderData.profilePictureRider;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating and fetching profile picture:", error);
    return null;
  }
};

export const updateEmailRider = async (newEmail, phoneNumber) => {
  if (isValidEmail(newEmail)) {
    try {
      const userDocRef = doc(db, "riders", phoneNumber);
      await updateDoc(userDocRef, {
        email: newEmail,
      });
      return true;
    } catch (error) {
      console.error("Error updating email:", error);
      return false;
    }
  } else {
    return false;
  }
};

export const saveRiderDataToFirestore = async (phoneNumber, riderData) => {
  try {
    await setDoc(doc(db, "riders", phoneNumber), riderData);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const addToOngoingOrders = async (orderId) => {
  try {
    const ongoingOrderRef = doc(db, "ongoingOrders", orderId);
    await setDoc(ongoingOrderRef, { orderId: orderId });
  } catch (error) {
    console.error("Error adding to ongoingOrders:", error);
  }
};

export const removeFromOngoingOrders = async (orderId) => {
  try {
    const ongoingOrderRef = doc(db, "ongoingOrders", orderId);
    await deleteDoc(ongoingOrderRef);
  } catch (error) {
    console.error("Error removing from ongoingOrders:", error);
  }
};

export const acceptOrderRider = async (orderId, riderName) => {
  try {
    const orderDocRef = doc(db, "purchases", orderId);
    await updateDoc(orderDocRef, {
      kitchenStatus: "RiderAccepts",
      rider: riderName,
    });
    return true;
  } catch (error) {
    console.error(`Error accepting order ${orderId}:`, error);
    return false;
  }
};

export const removeOrderRider = async (orderId) => {
  try {
    const orderDocRef = doc(db, "purchases", orderId);
    await updateDoc(orderDocRef, {
      kitchenStatus: "Ready",
      rider: "",
    });
    return true;
  } catch (error) {
    console.error(`Error accepting order ${orderId}:`, error);
    return false;
  }
};

export const addDeliveredMeal = async (orderId, riderId, deliveryFee) => {
  try {
    const purchasesRef = collection(db, "deliveredOrders");
    const newPurchaseDoc = doc(purchasesRef);
    const newOrderId = newPurchaseDoc.id;

    const purchaseData = {
      riderId: riderId,
      orderId: orderId,
      deliveryFee: deliveryFee,
      timestamp: serverTimestamp(),
    };
    await setDoc(newPurchaseDoc, purchaseData);
    return newOrderId;
  } catch (error) {
    console.error("Error adding purchase: ", error);
    return null;
  }
};

export const startOrderRider = async (orderId) => {
  try {
    const orderDocRef = doc(db, "purchases", orderId);
    await updateDoc(orderDocRef, {
      kitchenStatus: "PickedUp",
    });
    return true;
  } catch (error) {
    console.error(`Error accepting order ${orderId}:`, error);
    return false;
  }
};

export const deliveredMeal = async (orderId) => {
  try {
    const orderDocRef = doc(db, "purchases", orderId);
    await updateDoc(orderDocRef, {
      kitchenStatus: "Delivered",
    });
    return true;
  } catch (error) {
    console.error(`Error accepting order ${orderId}:`, error);
    return false;
  }
};

export const updateEarnings = async (riderId, amount) => {
  try {
    const riderDocRef = doc(db, "riders", riderId);
    await updateDoc(riderDocRef, {
      earnings: amount,
    });
    return true;
  } catch (error) {
    console.error(`Error updating earnings for ${riderId}:`, error);
    return false;
  }
};
