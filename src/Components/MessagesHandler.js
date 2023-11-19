import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getAllDevices } from "../Store/dataSliceFunctions";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { updateDeviceState } from "../Store/dataSlice";

function MessagesHandler({ client }) {
  const data = useSelector((state) => state.data);
  const allDevices = getAllDevices(data);

  const dispatch = useDispatch();

  const onMessageArrived = (message) => {
    console.log(
      "onMessageArrived: " +
        message.payloadString +
        " || for topic : " +
        message.topic
    );
    let deviceFound=false;
    allDevices.forEach((deviceOrg) => {
      const device = { ...deviceOrg };
      if (device.cumulativePath == message.topic) {
        if (device.type == "Slider") {
          if (
            isNaN(message.payloadString) ||
            isNaN(parseFloat(message.payloadString))
          ) {
            console.log(
              "Received: Slider " +
                device.cumulativePath +
                " but INVALID VALUE !! : " +
                message.payloadString
            );
            return;
          }
          if (parseFloat(message.payloadString) < device.params.minValue) {
            console.log(
              "Received: Slider " +
                device.cumulativePath +
                " but INVALID VALUE !! : " +
                message.payloadString +
                " with is less than the minimum " +
                device.params.minValue
            );
            device.state = device.params.minValue;
          } else if (
            parseFloat(message.payloadString) > device.params.maxValue
          ) {
            console.log(
              "Received: Slider " +
                device.cumulativePath +
                " but INVALID VALUE !! : " +
                message.payloadString +
                " with is more than the maximum " +
                device.params.maxValue
            );
            device.params.maxValue;
          } else {
            console.log(
              "Received: Slider " +
                device.cumulativePath +
                " set value to : " +
                message.payloadString
            );
            device.state = parseFloat(message.payloadString);
          }
        } else if (device.type == "Button") {
          if (message.payloadString == device.params.onMessage) {
            console.log(
              "Received: button" + device.cumulativePath + " was turned ON"
            );
            device.state = true;
          } else if (message.payloadString == device.params.offMessage) {
            console.log(
              "Received: button" + device.cumulativePath + " was turned OFF"
            );
            device.state = false;
          } else {
            console.log(
              "Received: button" +
                device.cumulativePath +
                " was turned OFF, UNKNOWN MESSAGE TYPE : " +
                message.payloadString
            );
            device.state = false;
          }
        } else {
          device.state = message.payloadString;
          console.log(
            "Received: customDevice" +
              device.cumulativePath +
              " had new state : " +
              message.payloadString
          );
        }
        deviceFound=true;
        dispatch(updateDeviceState(device));
        return;
      }
    });
    !deviceFound && console.log("no device found for topic : " + message.topic);
  };
  useEffect(() => {
    client.onMessageArrived = onMessageArrived;
  }, [client.isConnected()]);
  return (
    <View>
    </View>
  );
}

export default MessagesHandler;
