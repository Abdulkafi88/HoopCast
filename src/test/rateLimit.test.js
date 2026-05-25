import { describe, it, expect, beforeEach } from "vitest"
import { checkRateLimit, recordAttempt } from "../utils/rateLimit"

beforeEach(() => {
  localStorage.clear()
})

describe("checkRateLimit", () => {
  it("allows attempts under the limit", () => {
    const result = checkRateLimit("login")
    expect(result.allowed).toBe(true)
  })

  it("blocks after max login attempts", () => {
    for (let i = 0; i < 5; i++) recordAttempt("login")
    const result = checkRateLimit("login")
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBeGreaterThan(0)
  })

  it("blocks after max signup attempts", () => {
    for (let i = 0; i < 3; i++) recordAttempt("signup")
    const result = checkRateLimit("signup")
    expect(result.allowed).toBe(false)
  })

  it("resets after the window expires", () => {
    for (let i = 0; i < 5; i++) recordAttempt("login")

    // Backdate the window start so the window appears expired
    const record = JSON.parse(localStorage.getItem("rl_login"))
    record.windowStart = Date.now() - 16 * 60 * 1000
    localStorage.setItem("rl_login", JSON.stringify(record))

    const result = checkRateLimit("login")
    expect(result.allowed).toBe(true)
  })
})

describe("recordAttempt", () => {
  it("increments attempt count", () => {
    recordAttempt("login")
    recordAttempt("login")
    const record = JSON.parse(localStorage.getItem("rl_login"))
    expect(record.attempts).toBe(2)
  })
})
