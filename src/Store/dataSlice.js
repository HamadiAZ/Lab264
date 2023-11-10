import { createSlice } from '@reduxjs/toolkit'
import { test } from '../data'
import { setStateOfDevice } from './dataSliceFunctions';
const initialState = test;

export const counterSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {

    buttonSwitch: (state, action) => {
      //let newState=action.payload;
      console.log(action.payload);
      let {newState,path}=action.payload;
      setStateOfDevice(state,path,newState);
    },

    increment: (state) => {
      state.value += 1
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { increment, buttonSwitch } = counterSlice.actions

export default counterSlice.reducer