import React, { useEffect } from "react";
import Card from "../Components/Card";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSelector, useDispatch } from 'react-redux'
import { getTypes } from "../Store/dataSliceFunctions";


function ListTypes({ route }) {
  const navigation = useNavigation();
  const data = useSelector((state) => state.data);
  const types=getTypes(data);
  var list = Object.keys(types);
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
            Data={types[typeName]}
            separator=""
            showSetting={false}
            showPath={false}
          />
        );
      })}
    </View>
  );
}

export default ListTypes;
