import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView, Alert
} from "react-native";

import KeyboardAvoidingComponent from "../KeyboardWrap";

import { useSelector, useDispatch } from "react-redux";
import { getDeviceFromState } from "../../Store/dataSliceFunctions";

import {publishMessage} from "../../Screens/Connection";
import { updateDeviceState } from "../../Store/dataSlice";

function CustomItem({ name, path ,Data}) {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function onSend() {
    if (!isMqttConnected) {
      Alert.alert("Cant send your command","Please connect to your broker first!");
      return;
    }
    let stateCopy = { ...deviceState };
    stateCopy.state = message;
    publishMessage(message, Data.cumulativePath);
    dispatch(updateDeviceState(stateCopy));
  }

  const [message, setMessage] = useState(deviceState.state);
  
  return (
    <KeyboardAvoidingView>
      <View className="bg-gray-100 mt-1">
        <TouchableOpacity className="flex flex-row justify-between mb-0 pb-0">
          <View className="flex align-baseline justify-evenly h-15 w-auto rounded-sm p-3 ">
            <Text className="text-black text-xl">{name}</Text>
            <Text className="text-gray-500 mb-0 pb-0">{path}/</Text>
          </View>
          <View
            className="flex  align-baseline justify-center  h-14 rounded-sm mr-5 "
            onPress={""}
          >
            <Text className="text-l text-gray-400 mb-0 pb-0">
              {deviceState.state == "" ? "" : "=>" + deviceState.state}
            </Text>
          </View>
        </TouchableOpacity>
        <View className="flex flex-row px-3 h-9 justify-between align-middle mb-2">
          <TextInput className="border-b-2 border-gray-300 w-9/12" onChangeText={text => setMessage(text.toString())}
    value={message.toString()}
  />
          <TouchableOpacity className="p-2 bg-green-200 w-14 flex-1 justify-center items-center" onPress={onSend}>
            <Text >Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CustomItem;
