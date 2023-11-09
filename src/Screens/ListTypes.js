import React, { useEffect } from "react";
import Card from "../Components/Card";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { test, getTypes } from "../data";
import OpenCloseItem from "../Components/OpenCloseItem";

function ListTypes({ route }) {
  // const Data=route.params.Data;

  const navigation = useNavigation();
  let categories = getTypes(test);
  var list = Object.keys(categories);
  useEffect(() => {
    navigation.setOptions({
      title: "Types", // Set the new title for the navigation bar
    });
  }, []);

  return (
    <View className="flex-1 bg-white">
      {list.map((typeName, index) => {
        return (
          <Card
            key={index}
            name={typeName}
            path={categories[typeName][0].path}
            Data={categories[typeName]}
            separator=""
            navigation={navigation}
            showSetting={false}
            showPath={false}
          />
        );
      })}
    </View>
  );
}

export default ListTypes;
