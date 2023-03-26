import { render, screen } from '@testing-library/react'
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
