import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/HOme'
import Login from './components/Login';
import Register from './components/Register'

function App() {

  return (
    <Router>
    <div className='App'>
      <h2>Log In</h2>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </div>
  </Router>
  )
}

export default App
