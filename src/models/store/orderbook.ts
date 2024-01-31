import { ProductId } from 'enums'

export interface OrderbookState {
  initialBids: number[][];
  initialAsks: number[][];
  bids: number[][];
  asks: number[][];
  productId: ProductId;
  groupSize: number;
}
