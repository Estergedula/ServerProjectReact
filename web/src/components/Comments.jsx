import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import { UserContext } from './UserProvider'
import Select from 'react-select'
import { useForm } from "react-hook-form";
import { useNavigate, Outlet, useInRouterContext, useParams } from "react-router-dom";


const Comments = () => {
    const { id } = useParams()
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const nextCommentId = useRef(0)
    const [addDisplay, setAddDisplay] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();


    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            getData()
            getNextId();
        }, [])


    const reducer = (state, action) => {
        switch (action.type) {
            case "UPDATE":
                return state.map((comment) => {
                    if (comment.id == action.data.id) { return action.data; }
                    else { return comment; }
                })
            case "START":
                return action.data
            case "DELETE":
                return state.filter(comment => comment.id != action.id);
            case "ADD":
                return [...state, action.data];
            default:
                return state;
        }
    }
    const [currentComments, dispatch] = useReducer(reducer, []);

    const getData = () => {
        fetch(`http://localhost:3000/comments/?postId=${id}`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: "START", data: data })
            })

    }

    const getNextId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/commentsId`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                nextCommentId.current = data.value + 1;
            })
    }
    const addComment=(commentData)=>{
        fetch(`http://localhost:3000/comments`, {
            method: 'POST',
            body: JSON.stringify({
                postId:id,
                id: `${nextCommentId.current}`,
                name: commentData.name,
                email:user.email,
                body: commentData.body
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(data => {
                dispatch({ type: "ADD", data: data });
                reset()
            });
        updateId();
    }
    return (
        <>
            <button onClick={() => { setAddDisplay(display => !display) }}>+</button>
            {addDisplay&&
                <form onSubmit={handleSubmit(addComment)}>
                    <textarea type="text" placeholder="name" {...register("name")} /><br />
                    <textarea type="text" placeholder="body" {...register("body")} /><br />
                    <button type="submit">Add</button>
                </form>}
            {currentComments.map((comment, id) => {
                return <div><span> {comment.name}</span>
                    <span>{comment.body}</span></div>
            })}
        </>
    )
}

export default Comments;