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

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});
let client= new Paho.MQTT.Client("", 1, "");

export function publishMessage(publishPayload,publishTopic) {
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

  //const [host, setHost] = useState("192.168.0.219");
  //const [port, setPort] = useState(9001);
  const [host, setHost] = useState("ef4c58ce97fa40909e09b783589dd584.s1.eu.hivemq.cloud");
  const [port, setPort] = useState(8883);
  const [id, setId] = useState("Client" + parseInt(Math.random() * 100000));
  const [path, setPath] = useState("");

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

  function onPublishHandler(){
    publishMessage(publishPayload,publishTopic);
  }

  function unSubscribeHandler() {
    if (disconnectIfNotConnected()) return;
    client.unsubscribe(subscribeTopic);
    setSubscribeTopic("");
    setSubscribed(false);
  }

  function connect() {
    setStatus("isFetching");
    client=new Paho.MQTT.Client(host, port, publishTopic,id);
    client.connect({

      onSuccess: onSuccess,
      userName:"lab264",
      password:"MrRidhaHamdi264",
      useSSL: false,
      timeout: 3,
      hosts:["http://ef4c58ce97fa40909e09b783589dd584.s1.eu.hivemq.cloud:8883/mqtt"],
      ports:[8883],
      onFailure: onConnectionLost,
    });
  }
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


  connectDisconnectHandler = () => {
    if (isMqttConnected) disconnect();
    else connect();
  };

  return (
    <View className="flex-1">
      <MessagesHandler client={client} />
      <View className={isMqttConnected ? "bg-black py-3 items-center justify-center" : "bg-red-600 py-3 items-center justify-center"}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "600",
          }}
        >
          {isMqttConnected ? "MQTT connected" : "Not connected"}
        </Text>
      </View>
      <View className="justify-center items-center max-h-40">
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="pl-9">Host :</Text>
          <TextInput
            value={host}
            autoCapitalize={"none"}
            onChangeText={setHost}
          />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text>Port :</Text>

          <TextInput
            className="pr-2"
            value={port.toString()}
            autoCapitalize={"none"}
            keyboardType="numeric"
            onChangeText={t=>{
              if(parseInt(t)!=NaN) setPort(parseInt(t))
            }}
          />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text>Client Id :</Text>
          <TextInput
            className="pr-2"
            value={id}
            autoCapitalize={"none"}
            onChangeText={setId}
          />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="">Path :</Text>
          <TextInput
            placeholder={"enter Path"}
            value={path}
            autoCapitalize={"none"}
            onChangeText={setPath}
          />
        </View>
      </View>
      <Button
        type="solid"
        title={
          status == "isFetching"
            ? "connecting"
            : !isMqttConnected
            ? "connect"
            : "disconnect"
        }
        onPress={connectDisconnectHandler}
        color={isMqttConnected ? "red" : "#42b883"}
        disabled={status == "isFetching"}
      />
      <View style={styles.mainContainer}>
        {!isSubscribed ? (
          <View style={styles.subscribeContainer}>
            <TextInput
              placeholder="Enter topic to Subscribe"
              value={subscribeTopic}
              autoCapitalize={"none"}
              onChangeText={setSubscribeTopic}
              style={styles.inputStyle}
            />
            <Button
              type="solid"
              title="Subscribe"
              onPress={onSubscribeHandler}
              color="#42b883"
              disabled={!subscribeTopic}
            />
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
            <Button
              type="solid"
              title="UnSubscribe"
              onPress={unSubscribeHandler}
              color="#42b883"
            />
          </View>
        )}
      </View>
      <View style={styles.publishContainer}>
        <TextInput
          placeholder="Enter topic to publish"
          value={publishTopic}
          autoCapitalize={"none"}
          onChangeText={setPublishTopic}
          style={styles.inputStyle}
        />
        <TextInput
          placeholder="Enter Message"
          value={publishPayload}
          autoCapitalize={"none"}
          onChangeText={setPublishPayload}
          style={styles.inputStylePublish}
        />

        <Button
          type="solid"
          title="Publish"
          onPress={onPublishHandler}
          color="#42b883"
          disabled={!(publishTopic && publishPayload)}
        />
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
