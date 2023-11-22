import { View, Text, Animated, Easing } from "react-native";
import React, { useRef, useEffect } from "react";
import { publishMessage } from "../../Connection";
import { updateDeviceState } from "../../../Store/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDeviceFromState } from "../../../Store/dataSliceFunctions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Alert } from "react-native";
import TurningFan from "../../../Components/TurningFan";

const FanControl = ({ Data }) => {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function toggleHandle() {
    if (!isMqttConnected) {
      Alert.alert(
        "Cant Turn on the fan",
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

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop(); // Cleanup function
  }, []);

  return (
    <TouchableOpacity onPress={toggleHandle} className="w-20">
      {deviceState.state ? (
        <TurningFan />
      ) : (
    
          <MaterialCommunityIcons name="fan" size={80} color="black" />
       
      )}
    </TouchableOpacity>
  );
};

export default FanControl;
