import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import  {UserContext}  from './UserProvider'
import Select from 'react-select'
import { useForm } from "react-hook-form";
import { useNavigate, Outlet, useInRouterContext, useParams } from "react-router-dom";


const Comments = () => {
    const { id } = useParams()
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const [currentComments, setCurrentComments] = useState([]);

    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            fetch(`http://localhost:3000/comments/?postId=${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentComments(data);
            })

        }, [])

    return (
        <>
            {console.log(currentComments)}
            {currentComments.map((comment, id)=> {
                   return <div><span> {comment.name}</span>
                   <span>{comment.body}</span></div>
            }) }
        </>
    )
}

export default Comments;