import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { Ionicons, Material, CommunityIcons } from "@expo/vector-icons";
import init from "react_native_mqtt";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});
client = new Paho.MQTT.Client("", 1, "");
export default function Connection() {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [publishPayload, setPublishPayload] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [isSubscribed, setSubscribed] = useState(false);
  const [mqttConnected, setMqttConnected] = useState(false);

  const [host, setHost] = useState("192.168.0.209");
  const [port, setPort] = useState(9001);
  const [id, setId] = useState("id_" + parseInt(Math.random() * 100000));
  const [path, setPath] = useState("ENIG/Lab264/");
  
  const onSuccess = () => {
    console.info("Mqtt Connected");
    setStatus("Connected");
    setMqttConnected(true);
  };

  const onConnectionLost = () => {
    setMqttConnected(false);
    setStatus("notConnected");
    console.info("Mqtt Failed to connect");
  };

  function onSubscribeHandler() {
    if(disconnectIfNotConnected()) return;
    client.subscribe(subscribeTopic);
    setSubscribed(true);
  }

  function onPublishHandler() {
    if(disconnectIfNotConnected()) return;
    setPublishPayload("");
    var message = new Paho.MQTT.Message(id + ":" + publishPayload);
    message.destinationName = publishTopic;
    client.send(message);
  }

  function unSubscribeHandler() {
    if(disconnectIfNotConnected()) return;
    client.unsubscribe(subscribeTopic);
    setSubscribeTopic("");
    setSubscribed(false);
  }

  function connect() {
    client = new Paho.MQTT.Client(host, port, path);
    setStatus("isFetching");
    client.connect({
      onSuccess: onSuccess,
      useSSL: false,
      timeout: 3,
      onFailure: onConnectionLost,
    });
  }
  function disconnectIfNotConnected(){
    if(client.isConnected()) return false;
    disconnect();
    return true;
  }
  function disconnect() {
    setMqttConnected(false);
    setStatus("notConnected");
    console.info("Mqtt disconnected");
    if(client.isConnected()) client.disconnect();
  }
  useEffect(() => {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
  }, [client.isConnected()]);
  onMessageArrived = (message) => {
    console.log("onMessageArrived:" + message.payloadString);
  };
  connectDisconnectHandler = () => {
    console.log(mqttConnected);
    if (mqttConnected) disconnect();
    else connect();
  };

  return (
    <View className="flex-1">
      <View style={styles.statusContainer}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "600",
          }}
        >
          {mqttConnected ? "MQTT connected" : "Not connected"}
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
            onChangeText={setPort}
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
            : !mqttConnected
            ? "connect"
            : "disconnect"
        }
        onPress={connectDisconnectHandler}
        color={mqttConnected ? "red" : "#42b883"}
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
      <View style={styles.messageContainer}>
        <Text>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
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
