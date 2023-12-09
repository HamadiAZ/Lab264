import { createSlice } from "@reduxjs/toolkit";
import { test } from "../data";
import { setStateOfDevice, updateCumulativePath } from "./dataSliceFunctions";
const initialState = test;

export const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateDeviceState: (state, action) => {
      let newState = action.payload;
      setStateOfDevice(state, newState);
    },

    updateCumulativePaths: (state) => {
      updateCumulativePath(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceState, updateCumulativePaths } = DataSlice.actions;

export default DataSlice.reducer;
