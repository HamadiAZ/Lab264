import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 

function FirstLevelItems({name,path}) {
  return (
    <View className="flex flex-row justify-between bg-red-200 min-w-max mx-1 rounded-l mt-1">
      <View className="flex align-baseline justify-evenly bg-red-200 h-20 rounded-sm p-3 ">
      <Text className="text-black text-xl">{name}</Text>
            <Text className="text-gray-500">{path}/</Text>
      </View> 
      <View className="flex  align-baseline justify-center bg-red-200 h-20 rounded-sm mr-4">
        <AntDesign name="setting" size={28} color="black" />
      </View>
    </View>
  );
}

export default FirstLevelItems;
