import { createSlice } from "@reduxjs/toolkit";
import { setStateOfDevice, updateCumulativePath ,initializeAppDataFn} from "./dataSliceFunctions";
const initialState = {};

export const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateDeviceState: (state, action) => {
      let newState = action.payload;
      setStateOfDevice(state, newState);
    },

    initializeAppData:(state)=>{
      initializeAppDataFn(state);
    },

    setData:(state,action)=>{
      Object.assign(state, action.payload);
    },

    updateCumulativePaths: (state) => {
      updateCumulativePath(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceState, updateCumulativePaths,initializeAppData ,setData} = DataSlice.actions;

export default DataSlice.reducer;
