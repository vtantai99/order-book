/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */
import { createSlice, current } from '@reduxjs/toolkit'
import { MAX_LEVEL_ROWS } from 'constant'
import { ProductId } from 'enums'
import { OrderbookState } from 'models'
import { RootState } from 'stores'
import { mergeAndGroupLevelsBySize } from 'utils'

const filterPriceLevels = (price: number, levels: number[][]): number[][] => levels.filter((level) => level[0] !== price)

const updateAndReplacePriceLevel = (
  updatedLevel: number[],
  levels: number[][]
): number[][] => levels.map((level) => {
  if (level[0] === updatedLevel[0]) {
    return updatedLevel
  }
  return level
})

const isLevelExisting = (
  deltaLevelPrice: number,
  currentLevels: number[][]
): boolean => currentLevels.some((level) => level[0] === deltaLevelPrice)

const insertNewPriceLevel = (
  deltaLevel: number[],
  levels: number[][]
): number[][] => [...levels, deltaLevel]

const applyOrder = (
  currentLevels: number[][],
  orders: number[][]
): number[][] => {
  let updatedLevels: number[][] = currentLevels

  orders.forEach((orderDelta) => {
    const orderDeltaPrice = orderDelta[0]
    const orderDeltaSize = orderDelta[1]

    if (orderDeltaSize === 0 && updatedLevels.length > MAX_LEVEL_ROWS) {
      updatedLevels = filterPriceLevels(orderDeltaPrice, updatedLevels)
    } else {
      if (isLevelExisting(orderDeltaPrice, currentLevels)) {
        updatedLevels = updateAndReplacePriceLevel(orderDelta, updatedLevels)
      } else {
        if (updatedLevels.length < MAX_LEVEL_ROWS) {
          updatedLevels = insertNewPriceLevel(orderDelta, updatedLevels)
        }
      }
    }
  })

  return updatedLevels
}

const addTotalSums = (orders: number[][]): number[][] => {
  const totalSums: number[] = []

  return orders.map((order: number[], idx) => {
    const size: number = order[1]
    if (typeof order[2] !== 'undefined') {
      return order
    }
    const updatedLevel = [...order]
    const totalSum: number = idx === 0 ? size : size + totalSums[idx - 1]
    updatedLevel[2] = totalSum
    totalSums.push(totalSum)
    return updatedLevel
  })
}

const initialState: OrderbookState = {
  initialBids: [],
  initialAsks: [],
  bids: [],
  asks: [],
  productId: ProductId.PI_XBTUSD,
  groupSize: 0.5
}

export const orderBookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    addInitialState: (state, { payload }) => {
      const initialBids: number[][] = payload.bids
      const initialAsks: number[][] = payload.asks

      state.initialBids = initialBids
      state.initialAsks = initialAsks
      state.bids = addTotalSums(
        mergeAndGroupLevelsBySize(initialBids, current(state).groupSize)
      )
      state.asks = addTotalSums(
        mergeAndGroupLevelsBySize(initialAsks, current(state).groupSize)
      )
      state.productId = payload.product_id
    },
    addBids: (state, { payload }) => {
      const currentTicketSize: number = current(state).groupSize
      const groupedCurrentBids: number[][] = mergeAndGroupLevelsBySize(
        payload,
        currentTicketSize
      )
      const updatedBids: number[][] = addTotalSums(
        applyOrder(
          mergeAndGroupLevelsBySize(current(state).initialBids, currentTicketSize),
          groupedCurrentBids
        )
      )

      state.bids = updatedBids
    },
    addAsks: (state, { payload }) => {
      const currentGroupSize: number = current(state).groupSize
      const groupedCurrentAsks: number[][] = mergeAndGroupLevelsBySize(
        payload,
        currentGroupSize
      )
      const updatedAsks: number[][] = addTotalSums(
        applyOrder(
          mergeAndGroupLevelsBySize(current(state).initialAsks, currentGroupSize),
          groupedCurrentAsks
        )
      )

      state.asks = updatedAsks
    }
  }
})

export const { addInitialState, addBids, addAsks } = orderBookSlice.actions

export const selectBids = ({ orderbook }: RootState): number[][] => orderbook.bids
export const selectAsks = ({ orderbook }: RootState): number[][] => orderbook.asks
export const selectProductId = ({ orderbook }: RootState): ProductId => orderbook.productId

export default orderBookSlice.reducer
