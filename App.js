import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/styles";
import { Navigation } from "./src/navigation";
import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
//import { getAnalytics } from "firebase/analytics";
import { AuthenticationContextProviderCustomer } from "./src/context/authenticationCustomer.context";
import { AuthenticationContextProviderAdmin } from "./src/context/authenticationAdmin.context";
import { AuthenticationContextProviderRider } from "./src/context/authenticationRider.context";

//const analytics = getAnalytics(app);

export default function App() {
  const [oswaldLoaded] = useOswald({ Oswald_400Regular });
  const [latoLoaded] = useLato({ Lato_400Regular });
  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }
  return (
    <PaperProvider>
      <ThemeProvider theme={theme}>
        <AuthenticationContextProviderAdmin>
          <AuthenticationContextProviderRider>
            <AuthenticationContextProviderCustomer>
              <Navigation />
            </AuthenticationContextProviderCustomer>
          </AuthenticationContextProviderRider>
        </AuthenticationContextProviderAdmin>
      </ThemeProvider>
      <ExpoStatusBar style="auto" />
    </PaperProvider>
  );
}
