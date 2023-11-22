import { View, Text } from "react-native";
import React from "react";
import { publishMessage } from "../../Connection";
import { updateDeviceState } from "../../../Store/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import { getDeviceFromState } from "../../../Store/dataSliceFunctions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Alert } from "react-native";

const DoorControl = ({ Data }) => {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function toggleHandle() {
    if (!isMqttConnected) {
      Alert.alert(
        "Cant open the Door",
        "Please connect to your broker first!"
      );
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
    <TouchableOpacity onPress={toggleHandle}>
      {deviceState.state === true ? (
        <FontAwesome5 name="door-open" size={85} color="black" />
      ) : (
        <FontAwesome5 name="door-closed" size={85} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default DoorControl;
