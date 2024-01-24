import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import { UserContext } from '../UserProvider'
import Select from 'react-select'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './Posts.css'
const Posts = () => {
    const { user } = useContext(UserContext);
    const nextPostId = useRef(0)
    const [selectedPostId, setSelectedPostId] = useState()
    const [selectedUpdateId, setSelectedUpdateId] = useState()
    const navigate = useNavigate()
    const [display, setDisplay] = useState({ add: false, search: false })
    const searchOptions = [{ value: "id", label: "id" },
    { value: "alphabetical", label: "alphabetical" },
    { value: "all", label: "all" }]
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    let initialPosts = {
        posts: [],
        postsDisplay: []
    }

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
            case "CHANGE":
                return {
                    posts: state.posts.map((post) => {
                        if (post.id == action.data.id) { return action.data; }
                        else { return post; }
                    }),
                    postsDisplay: state.postsDisplay.map((post) => {
                        if (post.id == action.data.id) { return action.data; }
                        else { return post; }
                    })
                }
            case "START":
                return { posts: action.data, postsDisplay: action.data }
            case "DELETE":
                return {
                    posts: state.posts.filter(post => post.id != action.id),
                    postsDisplay: state.postsDisplay.filter(post => post.id != action.id)
                }
            case "ADD":
                return { posts: [...state.posts, action.data], postsDisplay: [...state.postsDisplay, action.data] }
            case "SEARCH":
                switch (action.search) {
                    case "id":
                        return { ...state, postsDisplay: state.posts.filter(post => post.id == action.data) }
                    case "all":
                        return { ...state, postsDisplay: state.posts }
                    default:
                        return { ...state, postsDisplay: state.posts.filter(post => post.title.includes(action.data)) }
                }
            default:
                return state;
        }
    }

    const [userPosts, dispatch] = useReducer(reducer, initialPosts);

    const getData = () => {
        fetch(`http://localhost:3000/posts/?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: "START", data: data })
            }
            )

    }

    const getNextId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/postsId`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                nextPostId.current = data.value + 1;
            }
            )
    }

    const updateId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/postsId`, {
            method: 'PATCH',
            body: JSON.stringify({
                value: nextPostId.current,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        nextPostId.current = nextPostId.current + 1;
    }

    const handleChangeSearch = (event) => {
        let searchBy = event.value;
        if (searchBy === "all") {
            dispatch({ type: "SEARCH", search: "all" });
        }
        else {
            setDisplay(prevDisplay => { return { ...prevDisplay, search: searchBy } })
        }
    }

    const search = (data) => {
        dispatch({ type: "SEARCH", search: display.search, data: data });
        if (display.search == "id") {
            reset();
            setDisplay(prevDisplay => { return { ...prevDisplay, search: null } })
        }
    }

    const addPost = (postData) => {
        fetch(`http://localhost:3000/posts`, {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                id: `${nextPostId.current}`,
                title: postData.title,
                body: postData.body
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(data => {
                reset();
                dispatch({ type: "ADD", data: data });
            });
        updateId();
    }

    const deletePost = async (postId) => {
        await fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE',
        })
        dispatch({ type: "DELETE", id: postId });
    }

    const onSubmitUpdate = (postId, dataInput) => {
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: dataInput.title,
                body: dataInput.body
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(response => response.json())
            .then(data => {
                dispatch({ type: "CHANGE", data: data })
            })
    }

    return (
        <>
            <div className="operations">
                <span><Select className="select" options={searchOptions} onChange={handleChangeSearch} placeholder="Search by..." />

                    {display.search == "id" && <form onSubmit={handleSubmit((data) => search(data["search"]))}>
                        <input type="text" placeholder="id" {...register("search")} /><br />
                        <button type="submit">Search</button> </form>}

                    {display.search == "alphabetical" && <input type="text" placeholder="search..." onChange={event => search(event.target.value)} />}
                </span>
                <span> <button onClick={() => { setDisplay(prevDisplay => { return { ...prevDisplay, add: !prevDisplay.add } }) }}>+</button>
                    {display.add &&
                        <form onSubmit={handleSubmit(addPost)}>
                            <textarea type="text" placeholder="title" {...register("title", { required: true })} /><br />
                            <textarea type="text" placeholder="body" {...register("body", { required: true })} /><br />
                            <button type="submit">Add</button>
                        </form>}
                </span>
            </div>
            {userPosts.postsDisplay.map((post, index) => {
                return (
                    <div key={index}>

                        <div className="posts">

                            <span>
                                <button className="showPost" style={selectedPostId == post.id?{backgroundImage:`url("/src/imgs/showPost.png")`}:{backgroundImage:`url(" /src/imgs/showPost1.png")`}}
                                 onClick={() => { selectedPostId === post.id ? setSelectedPostId(null) : setSelectedPostId(post.id) }}></button>
                                <span className="idSpan">Post {post.id}</span>
                            </span>
                            <span className="postTitle" style={selectedPostId == post.id ? { fontWeight: "600", color: "rgb(140, 177, 248)" } : null}>{post.title}</span>
                            <span className="btnSpan">
                                <button className="delete" onClick={() => deletePost(post.id)}></button>
                                <button className="update" onClick={() => {
                                    selectedUpdateId == post.id ? setSelectedUpdateId(null) : setSelectedUpdateId(post.id)
                                }}>
                                </button>
                            </span>
                           
                        </div>{selectedPostId === post.id && <><div className="postBody">{post.body}</div> <button onClick={() => navigate(`${post.id}/comments`)}>Comments</button></>}

                        {selectedUpdateId == post.id &&
                            <form onSubmit={handleSubmit(data => onSubmitUpdate(post.id, data))}>
                                <textarea type="text" defaultValue={post.title} placeholder="title" {...register("title", { required: true })} /><br />
                                <textarea type="text" defaultValue={post.title} placeholder="body" {...register("body", { required: true })} /><br />
                                <button type="submit">Update</button>
                            </form>
                        }
                    </div>
                )
            })}
        </>
    )
}
export default Posts