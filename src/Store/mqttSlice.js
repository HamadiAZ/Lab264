import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
};
export const mqttSlice = createSlice({
  name: "mqtt",
  initialState,
  reducers: {
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },

  },
});

// Action creators are generated for each case reducer function
export const { setIsConnected} = mqttSlice.actions;

export default mqttSlice.reducer;
