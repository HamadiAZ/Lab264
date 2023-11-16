import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput,KeyboardAvoidingView } from "react-native";


import { useSelector, useDispatch } from "react-redux";
import { buttonSwitch } from "../../Store/dataSlice";
import { getDeviceFromState } from "../../Store/dataSliceFunctions";

import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import { Input } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

function CustomItem({ name, path, params, navigation }) {
  const [lastMessageSent, setLastMessageSent] = useState("test");
  const [message, setMessage] = useState("");
  
  return ( 
    <SafeAreaView >
      <ScrollView>
      <TouchableOpacity className="flex flex-row justify-between">
        <View className="flex align-baseline justify-evenly h-20 w-auto rounded-sm p-3 ">
          <Text className="text-black text-xl">{name}</Text>
          <Text className="text-gray-500">{path}/</Text>
        </View>
        <View
          className="flex  align-baseline justify-center bg-gray-100 h-14 rounded-sm mr-5 "
          onPress={""}
        >
          <Text className="text-l text-gray-400">{"=>"+lastMessageSent}</Text>
        </View>
      </TouchableOpacity>
      <View className="flex flex-row px-4 h-9 justify-between align-middle  ">
        <TextInput className="border-b-2 border-gray-300 w-5/6">text zone</TextInput>
        <TouchableOpacity><Text className="p-2 bg-green-200 w-14">Send</Text></TouchableOpacity>
      </View></ScrollView>
    </SafeAreaView>
  );
}

export default CustomItem;
