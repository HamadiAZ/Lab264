import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/DrawerNavigator"; // Import your DrawerNavigator
import "react-native-gesture-handler";

import { store } from "./src/Store/store";
import { Provider, useDispatch } from "react-redux";

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
