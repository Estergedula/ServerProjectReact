import { useState, createContext } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Start from './components/Start'
import Info from './components/Info'
import Albums from './components/Albums'
import Posts from './components/Posts'
import Todos from './components/Todos'
import Photos from './components/Photos'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Comments from './components/Comments'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/users/:id" element={<Home />} >
            <Route path="info" element={<Info />} />
            <Route path="todos" element={<Todos />} />
            <Route path="albums" element={<Albums />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/:id/comments" element={<Comments />} />
            <Route path="albums/:id/photos" element={<Photos />} />
          </Route>
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}


export default App
