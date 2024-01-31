import styled from 'styled-components'

interface WrapperProps {
  reverse: boolean;
}

interface ContentProps {
  priceColor?: 'green' | 'red';
}

export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
`

export const Content = styled.p<ContentProps>`
  flex: 1;
  text-align: center;
  margin-bottom: 7px;
  color: ${({ priceColor }) => priceColor || 'white'};
`
