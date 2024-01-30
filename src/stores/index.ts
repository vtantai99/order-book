import { configureStore } from '@reduxjs/toolkit'
import orderBookReducer from 'components/OrderBook/orderBookSlice'

export const store = configureStore({
  reducer: {
    orderbook: orderBookReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
