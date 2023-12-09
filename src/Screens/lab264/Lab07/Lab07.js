import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import ConnectionStatusBar from "../../../Components/ConnectionStatusBar";

import { StyleSheet } from "react-native";
import { getListDeviceFromState } from "../../../Store/dataSliceFunctions";
import DoorControl from "./DoorControl";
import FanControl from "./FanControl";
import LightControl from "./LightControl";
import PressureControl from "./PressureControl";

const Lab07 = ({ route }) => {
  let cumulativePath = route.params.card.cumulativePath;
  const listOfData = getListDeviceFromState(cumulativePath);
  const navigation = useNavigation();
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

  /*      useEffect(() => {
    navigation.addListener("focus", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    });

    navigation.addListener("blur", () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    });

    return () => {};
  }, [navigation]);  */

  return (
    <ScrollView>
      <ConnectionStatusBar />
      <ImageBackground source={require("../../../../assets/Lab07.jpg")} style={styles.backgroundImage} resizeMode="stretch">
        <View className="flex-1 flex-row w-full justify-between pl-2 pr-8 align-middle" style={{ marginTop: -2 }}>
          {pressureSliderControl != undefined && (
            <View className="w-7/12 mr-4" style={{ marginTop: 4 }}>
              <PressureControl Data={pressureSliderControl} />
            </View>
          )}
          {fanControl != undefined && <FanControl Data={fanControl} />}
          {lightControl != undefined && <LightControl Data={lightControl} />}
        </View>
        <View className="flex-1 flex-row w-full align-middle justify-center mt-14">{doorControl != undefined && <DoorControl Data={doorControl} />}</View>
      </ImageBackground>
    </ScrollView>
  );
};

export default Lab07;
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "stretch", // or 'stretch' or 'contain'
    marginTop: "7%",
    height: 400,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});
