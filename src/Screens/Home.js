import React from "react";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Card from "../Components/Card";
import ConnectionStatusBar from "../Components/ConnectionStatusBar";

function FirstLevelScreen() {
  const navigation = useNavigation();
  const reduxData = useSelector((state) => state.data);

  return (
    <View className="flex-1 bg-white">
      <ConnectionStatusBar />
      {reduxData.Data.map((card, index) => {
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
