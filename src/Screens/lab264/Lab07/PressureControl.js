import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { updateDeviceState } from "../../../Store/dataSlice";
import { getDeviceFromState } from "../../../Store/dataSliceFunctions";
import { publishMessage } from "../../Connection";

const PressureControl = ({ Data }) => {
  const dispatch = useDispatch();
  const deviceState = getDeviceFromState(Data.cumulativePath);

  const { maxValue, minValue } = deviceState.params;
  const [value, setValue] = useState(deviceState.state);

  const min = useSharedValue(minValue);
  const max = useSharedValue(maxValue);

  let numberAfterComma = 0;
  if (maxValue - minValue > 50) numberAfterComma = 0;
  else if (maxValue - minValue > 10) numberAfterComma = 1;
  else if (maxValue - minValue > 1) numberAfterComma = 2;
  else if (maxValue - minValue > 0.1) numberAfterComma = 3;
  else if (maxValue - minValue > 0.01) numberAfterComma = 4;
  else numberAfterComma = 5;

  const addedUnit = "Bar";

  const sliderValue = useSharedValue(value);
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  function updateValue(newValue) {
    if (!isMqttConnected) {
      return;
    }
    const tenPower = 10 ^ numberAfterComma;
    const roundedValue = (Math.round(newValue * tenPower) / tenPower).toFixed(numberAfterComma);
    setValue(roundedValue);
    return roundedValue;
  }

  function onSlidingComplete(newValue) {
    if (!isMqttConnected) {
      Alert.alert("Cant change slider value", "Please connect to your broker first!");
      return;
    }
    const x = updateValue(newValue);
    deviceState.state = x;
    dispatch(updateDeviceState(deviceState));
    publishMessage(x, Data.cumulativePath);
  }

  useEffect(() => {
    sliderValue.value = deviceState.state;
    updateValue(deviceState.state);
  }, [deviceState.state]);

  return (
    <View className="bg-gray-100 min-w-max mx-1 rounded-l mt-1 ">
      <Text className="text-xl">
        {value}
        {addedUnit}
      </Text>

      <View className="px-4 pb-3 h-7">
        <Slider progress={sliderValue} minimumValue={min} maximumValue={max} onValueChange={updateValue} onSlidingComplete={onSlidingComplete} theme={SliderTheme} disableTapEvent={true} />
      </View>
    </View>
  );
};
const SliderTheme = {
  disableMinTrackTintColor: "#fff",
  maximumTrackTintColor: "#fff",
  minimumTrackTintColor: "#000",
  cacheTrackTintColor: "#333",
  bubbleBackgroundColor: "#666",
};
export default PressureControl;
