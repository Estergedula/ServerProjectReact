import { useState,createContext} from 'react'
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

export const UserContext = createContext()
 function App() {
   
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("currentUser")))
  return (
    <>
      <Router>
      <UserContext.Provider value={{user,setUser}}>
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
          </UserContext.Provider>
      </Router>
    </>
  )
}


export default App
