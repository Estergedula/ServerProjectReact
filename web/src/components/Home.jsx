import React from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import './Home.css'


const Home = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    //const homeButtons = ["Info", "Todos", "Posts", "Albums", "Logout"]
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate('/logIn')
        }
    }, [])

const Logout=()=>{
    localStorage.clear();
    navigate('/logIn')
}
    return (
        <>
            <h1>{user.name}</h1>
            <div id="navigate">
                <Link to="./info" state={user}>Info</Link>
                <Link to="./todos" state={user}>Todos</Link>
                <Link to="./posts" state={user}>Posts</Link>
                <Link to="./albums" state={user}>Albums</Link>
                <a onClick={Logout}>Logout</a>
               
                <Outlet />
            </div>

        </>
    )
}
export default Home