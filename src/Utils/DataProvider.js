import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { setData, updateCumulativePaths } from "../Store/dataSlice";
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
