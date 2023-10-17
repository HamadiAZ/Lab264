import { Alert } from 'react-native';
import init from "react_native_mqtt";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

class MqttClient {
  constructor() {
    const clientId = "myclientid_" + parseInt(Math.random() * 100, 10);
    this.client = new Paho.MQTT.Client('192.168.0.219', 9001, clientId);
    this.client.onMessageArrived = this.onMessageArrived;
    this.callbacks = {};
    this.onSuccessHandler = undefined;
    this.onConnectionLostHandler = undefined;
    this.isConnected = false;
  }

  onConnect = (onSuccessHandler, onConnectionLostHandler) => {
    this.onSuccessHandler = onSuccessHandler;
    this.onConnectionLostHandler = onConnectionLostHandler;
    this.client.onConnectionLost = () => {
      this.isConnected = false;
      onConnectionLostHandler();
    };

    this.client.connect({
      timeout: 10,
      onSuccess: () => {
        this.isConnected = true;
        onSuccessHandler();
      },
      useSSL: false,
      onFailure: this.onError,
      reconnect: true,
      keepAliveInterval: 20,
      cleanSession: true,
    });
  };

  onError = ({errorMessage}) => {
    console.log(errorMessage);
    this.isConnected = false;
    Alert.alert('Failed', 'Failed to connect to MQTT', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Try Again',
        onPress: () =>
          this.onConnect(
            this.onSuccessHandler,
            this.onConnectionLostHandler,
          ),
      },
    ]);
  };

  onMessageArrived = message => {
    const {payloadString, topic} = message;
    console.log('onMessageArrived:', payloadString);
    this.callbacks[topic](payloadString);
  };

  onPublish = (topic, message) => {
    this.client.publish(topic, message);
  };

  onSubscribe = (topic, callback) => {
    this.callbacks[topic] = callback;
    this.client.subscribe(topic);
  };

  unsubscribe = topic => {
    delete this.callbacks[topic];
    this.client.unsubscribe(topic);
  };
}

let client = new MqttClient();
export {client as MqttClient};
