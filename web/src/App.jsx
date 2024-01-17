import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Start from './components/Start'
import Info from './components/Info'
import Albums from './components/Albums'
import Posts from './components/Posts'
import Todos from './components/Todos'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <div className='App'>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home/users/:id" element={<Home />} >
              <Route path="info" element={<Info />}/>
              <Route path="todos" element={<Todos />} />
              <Route path="albums" element={<Albums />} />
              <Route path="posts" element={<Posts />} />
            </Route>
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
