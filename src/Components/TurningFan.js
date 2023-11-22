import { View, Text ,Animated } from "react-native";
import React from "react";
import { useEffect,useRef } from "react";
import { Easing } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const TurningFan = () => {

  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();


  }, []);
  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <MaterialCommunityIcons name="fan" size={80} color="black" />
    </Animated.View>
  );
};

export default TurningFan;
