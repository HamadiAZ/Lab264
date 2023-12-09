import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { updateDeviceState } from "../../../Store/dataSlice";
import { getDeviceFromState } from "../../../Store/dataSliceFunctions";
import { publishMessage } from "../../Connection";

const LightControl = ({ Data }) => {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function toggleHandle() {
    if (!isMqttConnected) {
      Alert.alert("Cant Turn on the lamp", "Please connect to your broker first!");
      return;
    }
    let stateCopy = { ...deviceState };
    stateCopy.state = !stateCopy.state;
    let message = stateCopy.state == true ? stateCopy.params.onMessage : stateCopy.params.offMessage;
    publishMessage(message, Data.cumulativePath);
    dispatch(updateDeviceState(stateCopy));
  }

  return (
    <TouchableOpacity onPress={toggleHandle} className="ml-3">
      {deviceState.state === true ? <MaterialCommunityIcons name="lightbulb-on" size={70} color="#eedd82" style={{ opacity: 0.95 }} /> : <MaterialCommunityIcons name="lightbulb-outline" size={70} color="black" style={{ opacity: 0.12 }} />}
    </TouchableOpacity>
  );
};

export default LightControl;
