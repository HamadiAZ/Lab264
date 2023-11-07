import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import FirstLevelItems from "../Components/FirstLevelItems"

function FirstLevelScreen() {
  
  return (
    <View className="flex-1 bg-white">
      <FirstLevelItems name="hh" path="x"/>
      <FirstLevelItems name="hghhhh" path="xhh"/>
      
    </View> 
  );
}

export default FirstLevelScreen;
