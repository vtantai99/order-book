import { MAX_LEVEL_ROWS, WS_URL } from 'constant'
import { OrderBookType, ProductId } from 'enums'
import { useAppDispatch, useAppSelector } from 'hooks'
import { useCallback, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import LevelRow from 'components/LevelRow'
import { formatNumberWithLocale, formatPriceWithLocale } from 'utils/format'
import LevelHeader from 'components/LevelHeader'
import { nanoid } from 'nanoid'
import {
  addAsks,
  addBids,
  addInitialState,
  selectAsks,
  selectBids,
  selectProductId
} from './orderBookSlice'
import { Container, TableWrapper } from './styled'

interface Delta {
  bids: number[][];
  asks: number[][];
}

let currentBids: number[][] = []
let currentAsks: number[][] = []

function OrderBook() {
  // Stores
  const dispatch = useAppDispatch()
  const bids: number[][] = useAppSelector(selectBids)
  const asks: number[][] = useAppSelector(selectAsks)
  const productId: ProductId = useAppSelector(selectProductId)
  // End stores

  const process = (data: Delta) => {
    if (data?.bids?.length > 0) {
      currentBids = [...currentBids, ...data.bids]

      if (currentBids.length > MAX_LEVEL_ROWS) {
        dispatch(addBids(currentBids))
        currentBids = []
        currentBids.length = 0
      }
    }
    if (data?.asks?.length >= 0) {
      currentAsks = [...currentAsks, ...data.asks]

      if (currentAsks.length > MAX_LEVEL_ROWS) {
        dispatch(addAsks(currentAsks))
        currentAsks = []
        currentAsks.length = 0
      }
    }
  }

  const processMessages = (event: { data: string }) => {
    const response = JSON.parse(event.data)

    if (response.numLevels) {
      dispatch(addInitialState(response))
    } else {
      process(response)
    }
  }

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    onMessage: (event: WebSocketEventMap['message']) => {
      processMessages(event)
    }
  })

  const fetchData = useCallback(
    (product: ProductId) => {
      const unSubscribeMessage = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [ProductId[product]]
      }
      sendJsonMessage(unSubscribeMessage)

      const subscribeMessage = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [product]
      }
      sendJsonMessage(subscribeMessage)
    },
    [sendJsonMessage]
  )

  useEffect(() => {
    fetchData(productId)
  }, [productId, fetchData])

  const renderPriceLevels = (
    levels: number[][],
    orderType: OrderBookType = OrderBookType.BIDS
  ): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [...levels].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result = 0
        if (orderType === OrderBookType.BIDS) {
          result = nextLevel[0] - currentLevel[0]
        } else {
          result = currentLevel[0] - nextLevel[0]
        }
        return result
      }
    )

    return sortedLevelsByPrice.map((level) => {
      const calculatedTotal: number = level[2]
      const total: string = formatNumberWithLocale(calculatedTotal)
      const size: string = formatNumberWithLocale(level[1])
      const price: string = formatPriceWithLocale(level[0])

      return (
        <LevelRow
          key={nanoid()}
          total={total}
          size={size}
          price={price}
          reverse={orderType === OrderBookType.ASKS}
          priceColor={orderType === OrderBookType.BIDS ? 'green' : 'red'}
        />
      )
    })
  }

  return (
    <Container>
      <TableWrapper>
        <LevelHeader />
        {renderPriceLevels(bids, OrderBookType.BIDS)}
      </TableWrapper>
      <TableWrapper>
        <LevelHeader />
        {renderPriceLevels(asks, OrderBookType.ASKS)}
      </TableWrapper>
    </Container>
  )
}

export default OrderBook
