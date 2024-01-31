import styled from 'styled-components'

interface WrapperProps {
  reverse: boolean;
}

export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  margin-bottom: 30px;
`

export const Text = styled.p`
  flex: 1;
  text-transform: uppercase;
  text-align: center;
  font-size: 20px;
`
