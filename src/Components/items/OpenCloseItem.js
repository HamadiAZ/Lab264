import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { updateDeviceState } from "../../Store/dataSlice";
import { getDeviceFromState } from "../../Store/dataSliceFunctions";
import { publishMessage } from "../../Screens/Connection";

function OpenCloseItem({ name, path, Data, navigation }) {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);
  function toggleHandle() {
    if (!isMqttConnected) {
      Alert.alert("Cant flip the switch","Please connect to your broker first!");
      return;
    }
    let stateCopy = { ...deviceState };
    stateCopy.state = !stateCopy.state;
    let message =
      stateCopy.state == true
        ? stateCopy.params.onMessage
        : stateCopy.params.offMessage;
    publishMessage(message, Data.cumulativePath);
    dispatch(updateDeviceState(stateCopy));
  }

  return (
    <TouchableOpacity className="flex flex-row justify-between bg-gray-100 min-w-max mx-1 rounded-l mt-1">
      <View className="flex align-baseline justify-evenly h-20 w-auto rounded-sm p-3 ">
        <Text className="text-black text-xl">{name}</Text>
        <Text className="text-gray-500">{path}/</Text>
      </View>
      <View
        className="flex  align-baseline justify-center bg-gray-100 h-20 rounded-sm mr-4"
        onPress={toggleHandle}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            width: 64,
            height: 32,
            borderRadius: 32,
            padding: 4,
            backgroundColor: deviceState.state ? "limegreen" : "gray",
          }}
          onPress={() => toggleHandle()}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 32,
              backgroundColor: "white",
              transform: [
                {
                  translateX: deviceState.state ? 32 : 0,
                },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default OpenCloseItem;
