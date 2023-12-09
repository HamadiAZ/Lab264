import { View, Text } from "react-native";
import React from "react";
import { setData, updateCumulativePaths } from "../Store/dataSlice";
import { useDispatch } from "react-redux";
import { readObject } from "./asyncStorage";

async function DataProvider() {
  const dispatch = useDispatch();
  const data = await readObject("data");
  dispatch(setData(data));
  dispatch(updateCumulativePaths());
  return (
    <View>
    </View>
  );
}

export default DataProvider;
