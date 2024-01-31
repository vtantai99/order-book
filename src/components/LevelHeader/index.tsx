import { Text, Wrapper } from './styled'

type Props = {
  reverse?: boolean;
}

function LevelHeader({ reverse = false }: Props) {
  return (
    <Wrapper reverse={reverse}>
      <Text>Total</Text>
      <Text>Size</Text>
      <Text>Price</Text>
    </Wrapper>
  )
}

export default LevelHeader
