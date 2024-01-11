import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Start from './components/Start'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
 let x = "hello world"
  return (
    <>
      <Router>
        <div className='App'>
          <Routes>
          <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home x={x} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>  
    </>
  )
}

export default App
