import React from "react";
import { initializeApp } from "firebase/app";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles";
import { Navigation } from "./src/navigation";
import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
//import { getAnalytics } from "firebase/analytics";
import { AuthenticationContextProvider } from "./src/context/authentication.context";

const firebaseConfig = {
  apiKey: "AIzaSyB_xWVqAsFtNrb9EqWQxzbgOxOPa6TFSi4",
  authDomain: "projectvic-88bda.firebaseapp.com",
  projectId: "projectvic-88bda",
  storageBucket: "projectvic-88bda.appspot.com",
  messagingSenderId: "52747560164",
  appId: "1:52747560164:web:9fe95410cdd961da6138f1",
  measurementId: "G-N7EB8DERH4",
};

initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default function App() {
  const [oswaldLoaded] = useOswald({ Oswald_400Regular });
  const [latoLoaded] = useLato({ Lato_400Regular });
  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthenticationContextProvider>
          <Navigation />
        </AuthenticationContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style="auto" />
    </>
  );
}
