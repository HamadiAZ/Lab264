import { View, Text, ImageBackground, ScrollView } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import ConnectionStatusBar from "../../../Components/ConnectionStatusBar";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import LightControl from "./LightControl";
import {
  getDeviceFromState,
  getListDeviceFromState,
} from "../../../Store/dataSliceFunctions";
import FanControl from "./FanControl";
import PressureControl from "./PressureControl";
import DoorControl from "./DoorControl";

const Lab07 = ({ route }) => {
  const navigation = useNavigation();
  let cumulativePath = route.params.card.cumulativePath;
  const listOfData = getListDeviceFromState(cumulativePath);

  var lightControl;
  var fanControl;
  var pressureSliderControl;
  var doorControl;

  listOfData?.forEach((element) => {
    if (element.name == "Light Control") lightControl = element;
    if (element.name == "Fan Control") fanControl = element;
    if (element.name == "Pressure Control") pressureSliderControl = element;
    if (element.name == "Door Control") doorControl = element;
  });
  //get devices by cumulative Path
  //console.log(lightControl);

/*   useEffect(() => {
    navigation.addListener("focus", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    });

    navigation.addListener("blur", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    });

    return () => {};
  }, [navigation]); */

  return (
    <ScrollView>
      <ConnectionStatusBar />
      <View className="flex-1 flex-row w-full justify-between pl-2 pr-8 align-middle pt-20">
        {pressureSliderControl != undefined && (
          <View className="w-4/6 justify-center">
            <PressureControl Data={pressureSliderControl} />
          </View>
        )}
        {fanControl != undefined && <FanControl Data={fanControl} />}
        {lightControl != undefined && <LightControl Data={lightControl} />}
      </View>
      <View className="flex-1 flex-row w-full align-middle justify-center mt-14">
        {doorControl != undefined && <DoorControl Data={doorControl} />}
      </View>
    </ScrollView>
  );
};

export default Lab07;
