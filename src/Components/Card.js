import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function Card({
  name,
  path,
  Data,
  navigation,
  showPath = true,
  showSetting = true,
}) {

  function onPressNavigate() {
    navigation.navigate("ListCards", { name, path, Data });
  }
  function onPressSettings() {
    console.log("set ");
  } 
  return (
    <TouchableOpacity
      className="flex flex-row justify-between bg-gray-100 min-w-max mx-1 rounded-l mt-1"
      onPress={onPressNavigate}
    >
      <View className="flex align-baseline justify-evenly h-20 w-auto rounded-sm p-3 ">
        <Text className="text-black text-xl">{name}</Text>
        {showPath && <Text className="text-gray-500">{path}/</Text>}
      </View>

      {!showSetting && (
        <TouchableOpacity
          className="flex  align-baseline justify-center bg-gray-100 h-20 rounded-sm mr-4"
          onPress={onPressNavigate}
        >
          <AntDesign
            name="rightcircleo"
            className="flex  align-baseline justify-center bg-gray-100 h-20 rounded-sm mr-4"
            size={37}
            color="black"
          />
        </TouchableOpacity>
      )}
      {showSetting && (
        <TouchableOpacity
          className="flex  align-baseline justify-center bg-gray-100 h-20 rounded-sm mr-4"
          onPress={onPressSettings}
        >
          <AntDesign name="setting" size={28} color="black" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default Card;
