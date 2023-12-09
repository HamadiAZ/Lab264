import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { updateDeviceState } from "../../../Store/dataSlice";
import { getDeviceFromState } from "../../../Store/dataSliceFunctions";
import { publishMessage } from "../../Connection";

const DoorControl = ({ Data }) => {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function toggleHandle() {
    if (!isMqttConnected) {
      Alert.alert("Cant open the Door", "Please connect to your broker first!");
      return;
    }
    let stateCopy = { ...deviceState };
    stateCopy.state = !stateCopy.state;
    let message = stateCopy.state == true ? stateCopy.params.onMessage : stateCopy.params.offMessage;
    publishMessage(message, Data.cumulativePath);
    dispatch(updateDeviceState(stateCopy));
  }

  return (
    <TouchableOpacity onPress={toggleHandle} className="mr-14">
      {deviceState.state === true ? <FontAwesome5 name="door-open" size={85} color="black" /> : <FontAwesome5 name="door-closed" size={85} color="black" style={{ opacity: 0.4 }} />}
    </TouchableOpacity>
  );
};

export default DoorControl;
