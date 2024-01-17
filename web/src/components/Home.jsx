import React from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import './Home.css'


const Home = () => {
    const navigate = useNavigate()
    const Logout = () => {
        localStorage.clear();
        navigate('/logIn')
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