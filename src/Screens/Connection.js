import { AsyncStorage } from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { getAllDevices } from "../Store/dataSliceFunctions";
import { setIsCloudConnection, setIsConnected } from "../Store/mqttSlice";

import init from "react_native_mqtt";

import { CheckBox } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import MessagesHandler from "../Components/MessagesHandler";
import { readObject, storeObject } from "../Utils/asyncStorage";

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
const initialLocalData = {
  host: "192.168.0.219",
  port: "9001",
  id: "Client" + parseInt(Math.random() * 100000),
  path: "",
  userName: "",
  password: "",
  useSSL: false,
  isAuth: false,
};

export default function Connection() {
  const [status, setStatus] = useState("");

  const [publishPayload, setPublishPayload] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [isSubscribed, setSubscribed] = useState(false);

  const isMqttConnected = useSelector((state) => state.mqtt.isConnected);
  const isCloudConnection = useSelector((state) => state.mqtt.isCloudConnection);

  const data = useSelector((state) => state.data);
  const allDevices = getAllDevices(data);

  const dispatch = useDispatch();

  const [connectionParams, setConnectionParams] = useState(initialLocalData);
  let { host, port, userName, password, path, useSSL, isAuth, id } = connectionParams;

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

  function connect() {
    setStatus("isFetching");
    client = new Paho.MQTT.Client(host, Number(port), publishTopic, id);

    connectionObject = { host, port, userName, password, path, useSSL, isAuth, id };
    if (isCloudConnection) storeObject("cloudConnectionCredential", connectionObject);
    else storeObject("localConnectionCredential", connectionObject);

    client.connect({
      onSuccess: onSuccess,
      useSSL: useSSL,
      userName: isAuth ? userName : "",
      password: isAuth ? password : "",
      timeout: 3,
      uris: ["ws://" + host + ":" + Number(port) + (path.startsWith("/") ? path : "/" + path)],
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

  connectDisconnectHandler = () => {
    if (isMqttConnected) disconnect();
    else connect();
  };
  const handleTextChange = (text) => {
    // Replace any non-numeric characters with an empty string
    const numericText = text.replace(/[^0-9]/g, "");
    setConnectionParams((prev) => ({ ...prev, port: numericText }));
  };
  function handleCloudSwitch() {
    if (isMqttConnected) disconnect();
    dispatch(setIsCloudConnection(!isCloudConnection));
  }

  useEffect(() => {
    if (isCloudConnection)
      readObject("cloudConnectionCredential").then((connectionObject) => {
        if (connectionObject != undefined) setConnectionParams(connectionObject);
        else {
          console.log("got empty cloudConnectionCredential in loading");
          setConnectionParams({
            host: "test.mosquitto.org",
            port: "8081",
            id: "Client" + parseInt(Math.random() * 100000),
            path: "/mqtt",
            userName: "",
            password: "",
            useSSL: true,
            isAuth: false,
          });
        }
      });

    if (!isCloudConnection)
      readObject("localConnectionCredential").then((connectionObject) => {
        if (connectionObject != undefined) setConnectionParams(connectionObject);
        else {
          setConnectionParams(initialLocalData);
          console.log("got empty localConnectionCredential in loading");
        }
      });
  }, [isCloudConnection]);

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
      <View className="justify-center items-center max-h-60">
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="pl-9">Host :</Text>
          <TextInput value={host} autoCapitalize={"none"} style={{ maxWidth: "70%" }} onChangeText={(newVal) => setConnectionParams((prev) => ({ ...prev, host: newVal }))} className="w-fit overflow-auto" />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text>Port :</Text>

          <TextInput className="pr-2" keyboardType="numeric" onChangeText={handleTextChange} value={port} />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text>Client Id :</Text>
          <TextInput className="pr-2" value={id} autoCapitalize={"none"} onChangeText={(newVal) => setConnectionParams((prev) => ({ ...prev, id: newVal }))} />
        </View>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="">Path :</Text>
          <TextInput placeholder={"enter Path"} value={path} autoCapitalize={"none"} onChangeText={(newVal) => setConnectionParams((prev) => ({ ...prev, path: newVal }))} />
        </View>
        <View className="flex flex-row" style={{ marginTop: "-1%" }}>
          <View className="flex flex-row gap-2 items-center justify-center align-middle">
            <Text className="">Use SSL :</Text>
            <View className="overflow-clip bg-gray-100">
              <CheckBox containerStyle={{ backgroundColor: "rgb(243 244 246 / var(--tw-bg-opacity))" }} size={20} checkedColor="#42b883" checked={useSSL} onPress={() => setConnectionParams((prev) => ({ ...prev, useSSL: !prev.useSSL }))} />
            </View>
          </View>
          <View className="flex flex-row gap-2 items-center justify-center align-middle">
            <Text className="p-0">Authentication :</Text>
            <View className="overflow-clip bg-gray-100">
              <CheckBox containerStyle={{ backgroundColor: "rgb(243 244 246 / var(--tw-bg-opacity))" }} size={20} checkedColor="#42b883" checked={isAuth} onPress={() => setConnectionParams((prev) => ({ ...prev, isAuth: !prev.isAuth }))} />
            </View>
          </View>
        </View>
        {isAuth && (
          <View>
            <View className="flex flex-row gap-2 items-center justify-center">
              <Text>UserName :</Text>
              <TextInput className="pr-2" placeholder={"enter user name"} value={userName} autoCapitalize={"none"} onChangeText={(newVal) => setConnectionParams((prev) => ({ ...prev, userName: newVal }))} />
            </View>
            <View className="flex flex-row gap-2 items-center justify-center">
              <Text className="">Password :</Text>
              <TextInput text="password" placeholder={"enter password"} value={password} autoCapitalize={"none"} onChangeText={(newVal) => setConnectionParams((prev) => ({ ...prev, password: newVal }))} />
            </View>
          </View>
        )}
      </View>
      <Button type="solid" title={status == "isFetching" ? "connecting" : !isMqttConnected ? "connect" : "disconnect"} onPress={connectDisconnectHandler} color={isMqttConnected ? "red" : "#42b883"} disabled={status == "isFetching"} />
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
