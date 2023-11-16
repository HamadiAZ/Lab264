import React, { useEffect } from "react";
import Card from "../Components/Card";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useSelector, useDispatch } from 'react-redux'
import { updateCumulativePaths} from "../Store/dataSlice"
import { getAllDevices,getCategories } from "../Store/dataSliceFunctions";


function ListCategories() {

  const navigation = useNavigation();
  const data = useSelector((state) => state.data);
  const categories=getCategories(data);
  var list = Object.keys(categories);
  
  useEffect(() => {
    navigation.setOptions({
      title: "Categories", // Set the new title for the navigation bar
    });
  }, []);
  
  return (
    <View className="flex-1 bg-white">
      {list.map((categoryName, index) => {
       console.log(categories[categoryName][0]);
        return (
          <Card
            key={index}
            name={categoryName}
            path={categories[categoryName][0].path}
            Data={categories[categoryName]}
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
