import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {test} from "../data"
import Card from "../Components/Card";


function FirstLevelScreen() {
  const navigation = useNavigation();
  
  return (
    <View className="flex-1 bg-white">
      {test.Data.map((card, index) => {
        if (card.type == 1)
          return (
            <Card
              key={index}
              name={card.name}
              path={card.path}
              Data={card.Data}
              separator={card.separator}
              navigation={navigation}
            />
          );
        return (
          <Card
            key={index}
            name={card.name}
            path={card.path}
            separator={card.separator}
            Data={card.Data}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
}

export default FirstLevelScreen;
