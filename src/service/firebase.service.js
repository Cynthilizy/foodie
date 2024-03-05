import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import appConfig from "../../app.config";

const firebaseConfig = {
  apiKey: appConfig.expo.extra.apiKey,
  authDomain: appConfig.expo.extra.authDomain,
  projectId: appConfig.expo.extra.projectId,
  storageBucket: appConfig.expo.extra.storageBucket,
  messagingSenderId: appConfig.expo.extra.messagingSenderId,
  appId: appConfig.expo.extra.appId,
  measurementId: appConfig.expo.extra.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage(app);

export { db, auth, app, firebaseConfig, storage };
