/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */

import { Content, Wrapper } from './styled'

type Props = {
  total: string;
  size: string;
  price: string;
  reverse: boolean;
  priceColor: 'green' | 'red';
}

function LevelRow({
  total, size, price, reverse = false, priceColor = 'green'
}: Props) {
  return (
    <Wrapper reverse={reverse}>
      <Content>{total}</Content>
      <Content>{size}</Content>
      <Content priceColor={priceColor}>{price}</Content>
    </Wrapper>
  )
}

export default LevelRow
