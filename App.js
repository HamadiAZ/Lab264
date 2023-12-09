import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import DrawerNavigator from "./src/DrawerNavigator"; // Import your DrawerNavigator

import { Provider } from "react-redux";
import { store } from "./src/Store/store";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <DrawerNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
