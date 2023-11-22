import React,{useEffect} from "react";
import Card from "../Components/Card";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { test } from "./Home";
import OpenCloseItem from "../Components/items/OpenCloseItem";
import SliderItem from "../Components/items/SliderItem";
import CustomItem from "../Components/items/CustomItem";
import { useSelector } from "react-redux";
import ConnectionStatusBar from "../Components/ConnectionStatusBar";
import { ScrollView } from "react-native-gesture-handler";

function ListCards({ route }) {


  const name = route.params.name;

  const navigation = useNavigation();
  let list = route.params.Data; 
  useEffect(() => {
    navigation.setOptions({
      title: name, // Set the new title for the navigation bar
    });
  }, );
  
  return (
    <ScrollView className="bg-white">
      <ConnectionStatusBar />
      {
      
      list.map((card, index) => {
        console.log(card)
        if (card.type == "container")
          return (
            <Card
              key={index}
              name={card.name}
              path={card.cumulativePath}
              Data={card.Data}
              card={card}
              separator={card.separator}
              showSetting={!card.redirect}
              redirect={card.redirect}
            />
          );
          if (card.type == "Slider")
          return ( 
            <SliderItem
              key={index}
              name={card.name}
              path={card.cumulativePath}
              Data={card}
            />
          );
          if (card.type == "Button" || card.type == "Switch")
          return (
            <OpenCloseItem
            key={index}
            name={card.name}
            path={card.cumulativePath}
            Data={card}
          />
          );
        return (
          <CustomItem
            key={index}
            name={card.name}
            path={card.cumulativePath}
            Data={card}
          />
        );
      })}
    </ScrollView>
  );
}

export default ListCards;
