import React,{useEffect} from "react";
import Card from "../Components/Card";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { test } from "./Home";
import OpenCloseItem from "../Components/OpenCloseItem";

function ListCards({ route }) {
   const Data=route.params.Data;
  const path = route.params.path;
  const name = route.params.name;
  console.log(name)
  const navigation = useNavigation();
  let list = route.params.Data; 
  useEffect(() => {
    navigation.setOptions({
      title: name, // Set the new title for the navigation bar
    });
  }, );
  return (
    <View className="flex-1 bg-white">
      {list.map((card, index) => {
        if (card.type == "container")
          return (
            <Card
              key={index}
              name={card.name}
              path={path + card.separator + card.path}
              Data={card.Data}
              separator={card.separator}
              navigation={navigation}
            />
          );
        return (
          <OpenCloseItem
            key={index}
            name={card.name}
            path={path + card.separator + card.path}
            Data={card.Data}
            separator={card.separator}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
}

export default ListCards;