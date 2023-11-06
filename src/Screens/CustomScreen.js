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
  sync : {}
});
const options = {
  host: '192.168.1.111',
  port: 9001,
  path: '/',
  id: 'id_' + parseInt(Math.random()*100000)
};

client = new Paho.MQTT.Client(options.host, options.port, options.path);

export default function CustomScreen() {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [publishPayload, setPublishPayload] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [isSubscribed, setSubscribed] = useState(false);
  const [mqttConnected, setMqttConnected] = useState(false);

  

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
    client.subscribe(subscribeTopic);
    setSubscribed(true);
  }

  function onPublishHandler() {
    setPublishPayload("");
    var message = new Paho.MQTT.Message(options.id + ':' + publishPayload);
    message.destinationName = publishTopic;
    client.send(message);
  }

  function unSubscribeHandler() {
    client.unsubscribe(subscribeTopic);
    setSubscribeTopic("");
    setSubscribed(false);
  }

  function connect(){
      setStatus("isFetching");
      client.connect({
          onSuccess: onSuccess,
          useSSL: false,
          timeout: 3,
          onFailure: onConnectionLost
        });
  }
  function disconnect(){
    setMqttConnected(false);
    setStatus("notConnected");
    console.info("Mqtt disconnected");
    client.disconnect();
}
  useEffect(() => {
    //connect();
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
  }, []);
  onMessageArrived = (message)=> {
    console.log('onMessageArrived:' + message.payloadString);
  }
  connectDisconnectHandler = ()=>{
    console.log(mqttConnected);
    if(mqttConnected) disconnect();
    else connect();
    
  }
  return (
    <View style={styles.container}>
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
      <View className="flex-1 justify-center items-center bg-zinc-300 p-0 m-0 max-h-20">
        <Text
        className="p-0 m-0 h-fit"
          style={{
            color: "#000",
            fontWeight: "600",
          }}
        >
          host: {options.host+"\n"}
          port: {options.port+"\n"}
          id: {options.id}
        </Text>
      </View>
      <Button
              type="solid"
              title={status=="isFetching" ? "connecting" : (!mqttConnected ? "connect" : "disconnect")}
              onPress={connectDisconnectHandler}
              color={mqttConnected ? "red" : "#42b883"}
              disabled={status=="isFetching"}
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
