/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { reactLogo } from 'assets'
import OrderBook from 'components/OrderBook'
import Header from 'components/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />
      <OrderBook />
    </div>
  )
}

export default App
