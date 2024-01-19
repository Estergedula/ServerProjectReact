import React,{useContext,useEffect} from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router-dom";
import './Home.css'
import{UserContext} from '../App'

const Home = () => {
    const navigate = useNavigate()
    const {user,setUser} = useContext(UserContext);

    useEffect(()=>{
        if(user==null){
            navigate('/login')
        }
    },[])


    const Logout = () => {
        localStorage.clear();
        setUser(null)
        navigate('/login')
    }
    return (
        <>
            <h1>{user.name}</h1>
            <div id="navigate">
                <Link to="./info">Info</Link>
                <Link to="./todos">Todos</Link>
                <Link to="./posts">Posts</Link>
                <Link to="./albums">Albums</Link>
                <a onClick={Logout}>Logout</a>

                <Outlet />
            </div>

        </>
    )
}
export default Home