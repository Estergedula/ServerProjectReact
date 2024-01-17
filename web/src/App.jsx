import { useState,createContext } from 'react'
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
  const UserContext = createContext()
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("currentUser")))
  return (
    <>
      <Router>
      <UserContext.Provider value={[user,setUser]}>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={user==null?<Login />:<Home />} />
            <Route path="/home/users/:id" element={user=null?<Home />:<Login/>} >
              <Route path="info" element={user=null?<Info />:<Login/>}/>
              <Route path="todos" element={user=null?<Todos />:<Login/>} />
              <Route path="albums" element={user=null?<Albums />:<Login/>} />
              <Route path="posts" element={user=null?<Posts />:<Login/>} />
            </Route>
            <Route path="/register" element={<Register />} />
          </Routes>
          </UserContext.Provider>
      </Router>
    </>
  )
}

export default App
