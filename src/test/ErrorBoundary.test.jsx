import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ErrorBoundary from "../com/ErrorBoundary"

// Suppress expected console.error output from the boundary
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {})
})

const Bomb = () => { throw new Error("Test crash") }

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(<ErrorBoundary><p>All good</p></ErrorBoundary>)
    expect(screen.getByText("All good")).toBeInTheDocument()
  })

  it("shows fallback UI when a child throws", () => {
    render(<ErrorBoundary><Bomb /></ErrorBoundary>)
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
  })

  it("recovers when Try Again is clicked", async () => {
    const user = userEvent.setup()
    let shouldThrow = true
    const MaybeThrow = () => {
      if (shouldThrow) throw new Error("boom")
      return <p>Recovered</p>
    }

    render(<ErrorBoundary><MaybeThrow /></ErrorBoundary>)
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument()

    shouldThrow = false
    await user.click(screen.getByRole("button", { name: /try again/i }))
    expect(screen.getByText("Recovered")).toBeInTheDocument()
  })
})
