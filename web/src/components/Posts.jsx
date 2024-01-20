import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import { UserContext } from '../App'


const Posts = () => {
    const { user } = useContext(UserContext);
    const nextPostId = useRef(0)
    let initialPosts = []

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
            case "COMPLETE":
                return state.map((post) => {
                    if (post.id === action.id) {
                        return { ...post, completed: !post.completed };
                    } else {
                        return post;
                    }
                });
            case "START":
                return action.data;
            case "DELETE":
                return state.filter(post => post.id != action.id)
            default:
                return state;
        }
    }

    const getData = () => {
        fetch(`http://localhost:3000/posts/?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
                return data.map(post => { return { ...post, update: false } })
            })
            .then(initialPosts => { dispatch({ type: "START", data: initialPosts }) })

    }
    const [userPosts, dispatch] = useReducer(reducer, initialPosts);



    const getNextId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/postsId`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                nextPostId.current = data.value + 1;
            })
    }


    const addpost = () => {

    }

    const deletePost = async (taskId) => {
        await fetch(`http://localhost:3000/posts/${taskId}`, {
            method: 'DELETE',
        })
        dispatch({ type: "DELETE", id: taskId });
    }


    return (
        <>
            <div> {userPosts.map((post) => {
                return <div className="posts" key={post.id}><span>Post {post.id}</span>
                    <span className="postTitle">{post.title}</span><span className="btnSpan">
                        <button className="delete" onClick={() => deletePost(post.id)}></button>
                        <button className="update" onClick={() => updatePost(post.id)}></button></span></div>
            })}</div>

        </>
    )
}
export default Posts