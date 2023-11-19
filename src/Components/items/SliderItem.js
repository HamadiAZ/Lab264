import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { buttonSwitch, updateDeviceState } from "../../Store/dataSlice";
import { getDeviceFromState } from "../../Store/dataSliceFunctions";

import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";

function SliderItem({ name, path, Data, navigation }) {
  const dispatch = useDispatch()
  const deviceState=getDeviceFromState(Data.cumulativePath); 
  
  const { maxValue, minValue } = deviceState.params;
  const [value, setValue] = useState(deviceState.state);
  
  const min = useSharedValue(minValue);
  const max = useSharedValue(maxValue);
  const addedUnit="Bar";
  const numberAfterComma=0;

  const sliderValue = useSharedValue(value);
  
  function updateValue(newValue){
    const tenPower=10^numberAfterComma;
    const roundedValue=(Math.round(newValue * tenPower)/tenPower).toFixed(numberAfterComma);
    setValue(roundedValue)
    return roundedValue;
  }
  function onSlidingComplete(){
    deviceState.state=value;
    updateDeviceState(deviceState);
  }
useEffect(() => {
  sliderValue.value = deviceState.state;
  updateValue(deviceState.state)
}, [deviceState.state])


  return (
    <View className="bg-gray-100 min-w-max mx-1 rounded-l mt-1 ">
      <TouchableOpacity className="flex flex-row justify-between">
        <View className="flex align-baseline justify-evenly h-20 w-auto rounded-sm p-3 ">
          <Text className="text-black text-xl">{name}</Text>
          <Text className="text-gray-500">{path}/</Text>
        </View>
        <View
          className="flex  align-baseline justify-center bg-gray-100 h-14 rounded-sm mr-5 "
          onPress={""}
        >
          <Text className="text-xl">{value}{addedUnit}</Text>
        </View>
      </TouchableOpacity>
      <View className="px-4 pb-3 h-7">
        <Slider
          progress={sliderValue}
          minimumValue={min}
          maximumValue={max}
          onValueChange={updateValue}
          onSlidingComplete={onSlidingComplete}
          theme={SliderTheme}
          disableTapEvent={true}
          
        />
      </View>
    </View>
  );
}
const SliderTheme={
  disableMinTrackTintColor: '#fff',
  maximumTrackTintColor: '#fff',
  minimumTrackTintColor: '#000',
  cacheTrackTintColor: '#333',
  bubbleBackgroundColor: '#666',
}
export default SliderItem;
