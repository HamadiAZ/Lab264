import React, { useEffect } from "react";
import Card from "../Components/Card";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { test, getCategories } from "../data";
import OpenCloseItem from "../Components/OpenCloseItem";

function ListCategories({ route }) {
  // const Data=route.params.Data;

  const navigation = useNavigation();
  let categories = getCategories(test);
  var list = Object.keys(categories);
  useEffect(() => {
    navigation.setOptions({
      title: "Categories", // Set the new title for the navigation bar
    });
  }, []);

  return (
    <View className="flex-1 bg-white">
      {list.map((categoryName, index) => {
        return (
          <Card
            key={index}
            name={categoryName}
            path={categories[categoryName][0].path}
            Data={categories[categoryName]}
            separator=""
            navigation={navigation}
            showSetting={true}
            showPath={false}
          />
        );
      })}
    </View>
  );
}

export default ListCategories;
