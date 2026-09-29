import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

beforeEach(() => localStorage.clear())

describe('Daily Work Tracker', () => {
  it('logs in and displays the dashboard', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText(/good morning/i)).toBeInTheDocument()
    expect(screen.getByText("Today’s tasks")).toBeInTheDocument()
  })

  it('opens task creation from the dashboard', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    fireEvent.click(screen.getByRole('button', { name: /new task/i }))
    expect(screen.getByRole('heading', { name: /create a new task/i })).toBeInTheDocument()
  })
})
