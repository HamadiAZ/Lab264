import { configureStore } from '@reduxjs/toolkit'
import DataReducer from './dataSlice'
import mqttReducer from './mqttSlice'

export const store = configureStore({
  reducer: {
    data: DataReducer,
    mqtt: mqttReducer,
  },
})