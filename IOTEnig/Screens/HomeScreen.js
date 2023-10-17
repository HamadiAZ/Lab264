import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { Ionicons, Material, CommunityIcons } from "@expo/vector-icons";
import init from "react_native_mqtt";
import {MqttClient} from '../MqttClient';

const topicsub = "test";
const topic = "test";



export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [publishPayload, setPublishPayload] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [isSubscribed, setSubscribed] = useState(false);
  const [mqttConnected, setMqttConnected] = useState(false);

  useEffect(() => {
    MqttClient.onConnect(onSuccess, onConnectionLost);
  }, []);

  const onSuccess = () => {
    console.info("Mqtt Connected");
    setMqttConnected(true);
  };

  const onConnectionLost = () => {
    setMqttConnected(false);
    console.info("Mqtt Fail to connect");
  };

  const onSubscribe = (message) => {
    setMessage(message);
  };

  function onSubscribeHandler() {
    MqttClient.onSubscribe(subscribeTopic, onSubscribe);
    setSubscribed(true);
  }

  function onPublishHandler() {
    MqttClient.onPublish(publishTopic, publishPayload);
    setPublishPayload("");
  }

  function unSubscribeHandler() {
    MqttClient.unsubscribe(subscribeTopic);
    setSubscribeTopic("");
    setSubscribed(false);
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
