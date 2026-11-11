import React, { createContext, useContext, useEffect } from "react"

// The redesign is dark-only, so the theme is fixed to dark.
const DarkModeContext = createContext({ darkMode: true })

export const DarkModeProvider = ({ children }) => {
  useEffect(() => {
    document.body.setAttribute("data-theme", "dark")
    localStorage.removeItem("darkMode")
  }, [])

  return (
    <DarkModeContext.Provider value={{ darkMode: true }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => useContext(DarkModeContext)
