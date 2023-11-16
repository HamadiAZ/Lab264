import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { buttonSwitch } from "../../Store/dataSlice";
import { getDeviceFromState } from "../../Store/dataSliceFunctions";

import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";

function SliderItem({ name, path, params, navigation }) {
  const { maxValue, minValue } = params;
  const [value, setValue] = useState(minValue);

  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const addedUnit="Bar";
  const numberAfterComma=0;
  function updateValue(newValue){
    const tenPower=10^numberAfterComma;
    const roundedValue=(Math.round(newValue * tenPower)/tenPower).toFixed(numberAfterComma);
    setValue(roundedValue)
  }
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
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          onValueChange={updateValue}
          onSlidingComplete={(x)=>console.log(x) //i will do change green color when sent
          }
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
