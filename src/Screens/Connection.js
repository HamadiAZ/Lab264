import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { Ionicons, Material, CommunityIcons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { updateCumulativePaths, updateDeviceState } from "../Store/dataSlice";
import { getAllDevices } from "../Store/dataSliceFunctions";
import { setIsConnected } from "../Store/mqttSlice";

import init from "react_native_mqtt";

import MessagesHandler from "../Components/MessagesHandler";
import { TouchableOpacity } from "react-native-gesture-handler";
import { storeObject } from "../Utils/asyncStorage";
import CloudCnx from "../Components/Connection/CloudCnx";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});
let client = new Paho.MQTT.Client("", 1, "");

export function publishMessage(publishPayload, publishTopic) {
  if (!client.isConnected()) return;
  var message = new Paho.MQTT.Message(publishPayload.toString());
  message._setQos(2);
  message.destinationName = publishTopic;
  message._setRetained(true);
  client.send(message);
}

console.log("rerendered");
export default function Connection() {
  const [status, setStatus] = useState("");

  const [publishPayload, setPublishPayload] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [isSubscribed, setSubscribed] = useState(false);

  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);
  const data = useSelector((state) => state.data);
  const allDevices = getAllDevices(data);

  const dispatch = useDispatch();

  const [Chost, setCHost] = useState("ef4c58ce97fa40909e09b783589dd584.s1.eu.hivemq.cloud");
  const [Cport, setCPort] = useState("8884");
  const [Cid, setCId] = useState("Client" + parseInt(Math.random() * 100000));
  const [Cpath, setCPath] = useState("");
  const [CuserName, setCUserName] = useState("");
  const [Cpassword, setCPassword] = useState("");

  const [isCloudConnection, setIsCloudConnection] = useState(false);

  const onSuccess = () => {
    console.info("Mqtt Connected");
    setStatus("Connected");
    dispatch(setIsConnected(true));
    allDevices.forEach((device) => {
      client.subscribe(device.cumulativePath);
      console.log("subscribed to " + device.cumulativePath);
    });
  };

  const onConnectionLost = (e) => {
    console.log(e);
    dispatch(setIsConnected(false));
    setStatus("notConnected");
    console.info("Mqtt Failed to connect");
  };

  function onSubscribeHandler() {
    if (disconnectIfNotConnected()) return;
    client.subscribe(subscribeTopic);
    setSubscribed(true);
  }

  function onPublishHandler() {
    publishMessage(publishPayload, publishTopic);
  }

  function unSubscribeHandler() {
    if (disconnectIfNotConnected()) return;
    client.unsubscribe(subscribeTopic);
    setSubscribeTopic("");
    setSubscribed(false);
  }

  function connect({host,port,id,path,userName,password}) {
    setStatus("isFetching");
    client = new Paho.MQTT.Client(host, Number(port), publishTopic, id);

    connectionObject = { local: { host, port, userName, password, path }, cloud: { Chost, Cport, CuserName, Cpassword, Cpath } };
    storeObject("connectionData", connectionObject);
    client.connect({
      onSuccess: onSuccess,
      useSSL: true,
      userName: "lab264",
      password: "MrRidhaHamdi264",
      timeout: 3,
      uris: ["ws://" + host + ":" + Number(port) + "/mqtt"],
      onFailure: onConnectionLost,
    });
  }
  // "ws://ef4c58ce97fa40909e09b783589dd584.s1.eu.hivemq.cloud:8884/mqtt"
  function disconnectIfNotConnected() {
    if (client.isConnected()) return false;
    disconnect();
    return true;
  }
  function disconnect() {
    dispatch(setIsConnected(false));
    setStatus("notConnected");
    console.info("Mqtt disconnected");
    if (client.isConnected()) client.disconnect();
  }
  useEffect(() => {
    client.onConnectionLost = onConnectionLost;
  }, [client.isConnected()]);

  connectDisconnectHandler = (params) => {
    if (isMqttConnected) disconnect();
    else connect(params);
  };

  function handleCloudSwitch() {
    setIsCloudConnection((prev) => !prev);
  }

  return (
    <View className="flex-1">
      <MessagesHandler client={client} />
      <TouchableOpacity onPress={handleCloudSwitch} className={isMqttConnected ? "bg-black py-3 items-center justify-center" : "bg-red-600 py-3 items-center justify-center"}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "600",
          }}
        >
          {isMqttConnected ? "MQTT connected" : "Not connected"} - {isCloudConnection ? " Cloud" : " Local"}
        </Text>
      </TouchableOpacity>
      <CloudCnx status={status} connectDisconnectHandler={connectDisconnectHandler}/>
     
      <View style={styles.mainContainer}>
        {!isSubscribed ? (
          <View style={styles.subscribeContainer}>
            <TextInput placeholder="Enter topic to Subscribe" value={subscribeTopic} autoCapitalize={"none"} onChangeText={setSubscribeTopic} style={styles.inputStyle} />
            <Button type="solid" title="Subscribe" onPress={onSubscribeHandler} color="#42b883" disabled={!subscribeTopic} />
          </View>
        ) : (
          <View style={styles.subscribeContainer}>
            <Text
              style={{
                color: "blue",
                fontWeight: "600",
              }}
            >
              Subscribed topic: {subscribeTopic}
            </Text>
            <Button type="solid" title="UnSubscribe" onPress={unSubscribeHandler} color="#42b883" />
          </View>
        )}
      </View>
      <View style={styles.publishContainer}>
        <TextInput placeholder="Enter topic to publish" value={publishTopic} autoCapitalize={"none"} onChangeText={setPublishTopic} style={styles.inputStyle} />
        <TextInput placeholder="Enter Message" value={publishPayload} autoCapitalize={"none"} onChangeText={setPublishPayload} style={styles.inputStylePublish} />

        <Button type="solid" title="Publish" onPress={onPublishHandler} color="#42b883" disabled={!(publishTopic && publishPayload)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {},
  subscribeContainer: {
    marginVertical: 50,
    marginHorizontal: 30,
    justifyContent: "center",
  },
  inputStyle: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  inputStylePublish: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    paddingVertical: 5,
    marginVertical: 20,
  },
  publishContainer: {
    marginVertical: 10,
    marginHorizontal: 30,
  },
  messageContainer: {
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});
