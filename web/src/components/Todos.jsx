import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router-dom";

const Todos = () => {
    const [userTodos, setUserTodos] = useState([])
    const { id } = useParams()
    const { user, } = useContext(UserContext);
    useEffect(
        () => {
            fetch(`http://localhost:3000/todos/?userId=${id}`)
                .then(response => response.json())
                .then(data => {
                    setUserTodos(data)
                })
        }, []
    )
    return (
        <>
            {userTodos.map((todo) => { <div><span>task Id:{todo.id}</span><span>{todo.title}</span></div> })}
        </>
    )
}
export default Todos