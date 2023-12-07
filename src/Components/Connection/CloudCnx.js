import { View, Text,Button } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

function CloudCnx({status,connectDisconnectHandler}) {
    
  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);

  const [host, setHost] = useState("192.168.0.219");
  const [port, setPort] = useState("9001");
  const [id, setId] = useState("Client" + parseInt(Math.random() * 100000));
  const [path, setPath] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleTextChange = (text) => {
    // Replace any non-numeric characters with an empty string
    const numericText = text.replace(/[^0-9]/g, "");
    setPort(numericText);
  };

  function localConnectionHandler(){
    connectDisconnectHandler({host,port,id,path,userName,password})
  }
  return (
    <View>
      <View className="justify-center items-center max-h-40">
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="pl-9">Host :</Text>
          <TextInput value={host} autoCapitalize={"none"} style={{ maxWidth: "70%" }} onChangeText={setHost} className="w-fit overflow-auto" />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text>Port :</Text>

          <TextInput className="pr-2" keyboardType="numeric" onChangeText={handleTextChange} value={port} />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text>Client Id :</Text>
          <TextInput className="pr-2" value={id} autoCapitalize={"none"} onChangeText={setId} />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="">Path :</Text>
          <TextInput placeholder={"enter Path"} value={path} autoCapitalize={"none"} onChangeText={setPath} />
        </View>
      </View>
      <Button type="solid" title={status == "isFetching" ? "connecting" : !isMqttConnected ? "connect" : "disconnect"} onPress={connectDisconnectHandler} color={isMqttConnected ? "red" : "#42b883"} disabled={status == "isFetching"} />
    </View>
  );
}

export default CloudCnx;
