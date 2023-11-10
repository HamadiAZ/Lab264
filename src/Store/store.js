import { configureStore } from '@reduxjs/toolkit'
import DataReducer from './dataSlice'

export const store = configureStore({
  reducer: {
    data: DataReducer,
  },
})