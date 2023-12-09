import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

function ConnectionStatusBar() {
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);
  const isCloudConnection = useSelector((state) => state.mqtt.isCloudConnection);
  const navigation = useNavigation();
  function onPressNavigate() {
    navigation.navigate("Connection manager");
  }
  return (
    <TouchableOpacity onPress={onPressNavigate} className={isMqttConnected ? "bg-black py-3 items-center justify-center" : "bg-red-600 py-3 items-center justify-center"}>
      <Text
        style={{
          color: "#fff",
          fontWeight: "600",
        }}
      >
        {isMqttConnected ? "MQTT connected" : "Not connected"} - {isCloudConnection ? " Cloud" : " Local"}
      </Text>
    </TouchableOpacity>
  );
}

export default ConnectionStatusBar;
