import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import FirstLevelItems from "../Components/FirstLevelItems"

function FirstLevelScreen() {
  
  return (
    <View className="flex-1 bg-white">
      <FirstLevelItems name="hh" path="x"/>
      <View className="flex flex-col bg-white min-h-full min-w-full pt-1">
        <View className="flex flex-row justify-between bg-red-200 min-w-max mx-1 rounded-l mt-1">
          <View className="flex align-baseline justify-evenly bg-red-200 h-20 rounded-sm p-3 ">
            <Text className="text-black text-xl">{"gg"}</Text>
            <Text className="text-gray-500">{"ghggf"}/</Text>
          </View>
          <View className="flex  align-baseline justify-center bg-red-200 h-20 rounded-sm mr-4">
            <AntDesign name="setting" size={28} color="black" />
          </View>
        </View>
      </View>
    </View> 
  );
}

export default FirstLevelScreen;
