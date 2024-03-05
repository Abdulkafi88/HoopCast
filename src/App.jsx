import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav from './com/Nba'
import Home from './com/Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

     <Home/>
    </>
  )
}

export default App
