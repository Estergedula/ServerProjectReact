import React, { useContext, useEffect } from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router-dom";
import './Home.css'
import { UserContext } from '../App'

const Home = () => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext);
    const navigates = ["info", "todos", "posts", "albums", "Logout"]
    useEffect(() => {
        if (user == null) {
            navigate('/login')
        }
    }, [])

    const handleNavigate = (navigateChoice) => {
        if (navigateChoice == "Logout") {
            Logout();
        }
        else {
            navigate(`./${navigateChoice}`)
        }
    }
    const Logout = () => {
        localStorage.clear();
        setUser(null)
        navigate('/login')
    }
    return (
        <>
            <h1>{user.name}</h1>
            {/* <div id="navigate">
                <Link to="./info">Info</Link>
                <Link to="./todos">Todos</Link>
                <Link to="./posts">Posts</Link>
                <Link to="./albums">Albums</Link>
                <a onClick={Logout}>Logout</a>

                <Outlet />
            </div> */}
            <nav>{navigates.map(navigate => <button onClick={() => handleNavigate(navigate)} key={navigate}>{navigate}</button>)}</nav>

            <Outlet />
        </>
    )
}
export default Home