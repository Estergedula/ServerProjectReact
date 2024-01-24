import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import { UserContext } from '../UserProvider'
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import './Comments.css'

const Comments = () => {
    const { id } = useParams()
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const nextCommentId = useRef(0)
    const [selectedUpdateId, setSelectedUpdateId] = useState()
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
        }, []
    )

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

    const updateId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/commentsId`, {
            method: 'PATCH',
            body: JSON.stringify({
                value: nextCommentId.current,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        nextCommentId.current = nextCommentId.current + 1;
    }

    const deleteComment = async (commentId) => {
        await fetch(`http://localhost:3000/comments/${commentId}`, {
            method: 'DELETE',
        })
        dispatch({ type: "DELETE", id: commentId });
    }

    const addComment = (commentData) => {
        fetch(`http://localhost:3000/comments`, {
            method: 'POST',
            body: JSON.stringify({
                postId: id,
                id: `${nextCommentId.current}`,
                name: commentData.name,
                email: user.email,
                body: commentData.body
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(data => {
                reset()
                dispatch({ type: "ADD", data: data });
            });
        updateId();
    }

    const onSubmitUpdate = (postId, dataInput) => {
        fetch(`http://localhost:3000/comments/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: dataInput.title,
                body: dataInput.body
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json())
            .then(data => {
                dispatch({ type: "UPDATE", data: data })
            })
    }

    return (
        <>
            <button onClick={() => { setAddDisplay(display => !display) }}>+</button>
            {addDisplay &&
                <form onSubmit={handleSubmit(addComment)}>
                    <textarea type="text" placeholder="name" {...register("name", { required: true })} /><br />
                    <textarea type="text" placeholder="body" {...register("body", { required: true })} /><br />
                    <button type="submit">Add</button>
                </form>
            }
            {currentComments.map((comment) => {
                return (
                    <div key={comment.id} className="comment">
                        <div>
                            <span>comment Id:{comment.id} <span className="commentName">{comment.name}</span></span>
                            <div>{comment.body}</div>
                        </div>
                        {comment.email === user.email && <span className="commentBtns">
                            <button className="delete" onClick={() => deleteComment(comment.id)}></button>
                            <button className="update" onClick={() => {
                                selectedUpdateId == comment.id ? setSelectedUpdateId(null) : setSelectedUpdateId(comment.id)
                            }}></button>
                        </span>}
                        {selectedUpdateId == comment.id && <form className="updateForm" onSubmit={handleSubmit(data => onSubmitUpdate(comment.id, data))}>
                            <textarea type="text" defaultValue={comment.name} placeholder="name" {...register("name", { required: true })} /><br />
                            <textarea type="text" defaultValue={comment.body} placeholder="body" {...register("body", { required: true })} /><br />
                            <button type="submit">Update</button>
                        </form>}
                    </div>)
            })}
        </>
    )
}

export default Comments;