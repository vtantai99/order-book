import { fireEvent, render, screen } from '@testing-library/react'
import App from 'App'
import { describe, it } from 'vitest'

describe('App', () => {
  it('Render title of app', () => {
    // ARRANGE
    render(<App />)
    // ACT
    // EXPECT
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vite + React')
  })
})

describe('Click on button', () => {
  it('should render count be increased', async () => {
    // ARRANGE
    render(<App />)
    // ACT
    const buttonEl = screen.getByRole('button')
    fireEvent.click(buttonEl)
    fireEvent.click(buttonEl)
    // EXPECT
    expect(buttonEl).toHaveTextContent('count is 2')
  })
})
