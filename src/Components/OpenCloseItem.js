 
 import React, { useState } from "react";
import { View, Text, TouchableOpacity,Animated } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { useSelector, useDispatch } from 'react-redux'
import { buttonSwitch } from '../Store/dataSlice'
import { getDeviceFromState } from "../Store/dataSliceFunctions";

function OpenCloseItem({ name, path ,Data,navigation}) {
  
  const dispatch = useDispatch()


  //const [isOn, setIsOn] = useState(false)
  isOn=getDeviceFromState(path); 
  console.log(getDeviceFromState(path));
  console.log(path);
  function toggleHandle() {
    console.log(!isOn ? "Open ": "Close");
    dispatch(buttonSwitch({newState:!isOn,path}));
    //setIsOn(!isOn);
  }

  return (
    <TouchableOpacity className="flex flex-row justify-between bg-gray-100 min-w-max mx-1 rounded-l mt-1">
        <View className="flex align-baseline justify-evenly h-20 w-auto rounded-sm p-3 " >
          <Text className="text-black text-xl">{name}</Text>
          <Text className="text-gray-500">{path}/</Text>
        </View >
        <View className="flex  align-baseline justify-center bg-gray-100 h-20 rounded-sm mr-4" onPress={toggleHandle}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            width: 64,
            height: 32,
            borderRadius: 32,
            padding: 4,
            backgroundColor: isOn
              ? "limegreen"
              : "gray",
          }}
          onPress={() => toggleHandle()}
        >
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 32,
            backgroundColor:"white",
            transform: [{
              translateX: isOn ? 32 : 0,
            }]
          }} />
        </TouchableOpacity>
        </View>

    </TouchableOpacity>
  );
}

export default OpenCloseItem;

