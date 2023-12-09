import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, Easing } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import TurningFan from "../../../Components/TurningFan";
import { updateDeviceState } from "../../../Store/dataSlice";
import { getDeviceFromState } from "../../../Store/dataSliceFunctions";
import { publishMessage } from "../../Connection";

const FanControl = ({ Data }) => {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function toggleHandle() {
    if (!isMqttConnected) {
      Alert.alert("Cant Turn on the fan", "Please connect to your broker first!");
      return;
    }
    let stateCopy = { ...deviceState };
    stateCopy.state = !stateCopy.state;
    let message = stateCopy.state == true ? stateCopy.params.onMessage : stateCopy.params.offMessage;
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
    <TouchableOpacity onPress={toggleHandle} className="w-19">
      {deviceState.state ? <TurningFan /> : <MaterialCommunityIcons name="fan" size={70} color="black" style={{ opacity: 0.1 }} />}
    </TouchableOpacity>
  );
};

export default FanControl;
