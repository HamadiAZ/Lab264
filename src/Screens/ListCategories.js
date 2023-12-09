import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View } from "react-native";
import Card from "../Components/Card";

import { useSelector } from "react-redux";
import ConnectionStatusBar from "../Components/ConnectionStatusBar";
import { getCategories } from "../Store/dataSliceFunctions";

function ListCategories() {
  const navigation = useNavigation();
  const data = useSelector((state) => state.data);
  const categories = getCategories(data);
  var list = Object.keys(categories);

  useEffect(() => {
    navigation.setOptions({
      title: "Categories", // Set the new title for the navigation bar
    });
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ConnectionStatusBar />
      {list.map((categoryName, index) => {
        return <Card key={index} name={categoryName} path={categories[categoryName][0].path} Data={categories[categoryName]} navigation={navigation} showSetting={false} showPath={false} />;
      })}
    </View>
  );
}

export default ListCategories;
