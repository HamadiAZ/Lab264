
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/DrawerNavigator"; // Import your DrawerNavigator
import 'react-native-gesture-handler';

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
