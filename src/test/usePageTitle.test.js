import { describe, it, expect, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import usePageTitle from "../hooks/usePageTitle"

afterEach(() => {
  document.title = ""
})

describe("usePageTitle", () => {
  it("sets document title with HoopCast suffix", () => {
    renderHook(() => usePageTitle("Games"))
    expect(document.title).toBe("Games | HoopCast")
  })

  it("sets base title when no argument provided", () => {
    renderHook(() => usePageTitle(null))
    expect(document.title).toBe("HoopCast")
  })

  it("resets title on unmount", () => {
    const { unmount } = renderHook(() => usePageTitle("Players"))
    expect(document.title).toBe("Players | HoopCast")
    unmount()
    expect(document.title).toBe("HoopCast")
  })
})
