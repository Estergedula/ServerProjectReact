import './App.css'
import Login from './components/Forms/Login'
import Register from './components/Forms/Register'
import Home from './components/Home/Home'
import Start from './components/Start'
import Info from './components/Info/Info'
import Albums from './components/Albums/Albums'
import Posts from './components/Posts/Posts'
import Todos from './components/Todos/Todos'
import Photos from './components/Photos/Photos'
import Comments from './components/Comments/Comments'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home/users/:id" element={<Home />} >
            <Route path="info" element={<Info />} />
            <Route path="todos" element={<Todos />} />
            <Route path='albums'>
            <Route index element={<Albums />} />
            <Route path=":albumId/photos" element={<Photos />} />
            </Route>
            <Route path='posts'>
            <Route index element={<Posts />} />
            <Route path=":postId/comments" element={<Comments />} />
            </Route>
          </Route>
         <Route path="*" element={<p>This site cannot be accessed</p>} />
        </Routes>
      </Router>
    </>
  )
}


export default App
