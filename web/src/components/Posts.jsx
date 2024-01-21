import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import { UserContext } from '../App'
import Select from 'react-select'
import { useForm } from "react-hook-form";

const Posts = () => {
    const { user } = useContext(UserContext);
    const nextPostId = useRef(0)
    const currentUpdateId = useRef(null)
    const [display, setDisplay] = useState({ add: false, search: false })
    const searchOptions = [{ value: "id", label: "id" },
    { value: "alphabetical", label: "alphabetical" },
    { value: "all", label: "all" }]
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();
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
            case "CHANGE":
                return state.map((post) => {
                    if (post.id == action.data.id) {
                        return action.data;
                    } else {
                        return post;
                    }
                });
            case "DISPLAY":
                return state.map((todo) => {
                    if (todo.id === action.id) {
                        return { ...todo, update: !todo.update };
                    } else {
                        return todo;
                    }
                });
            case "START":
                return action.data;
            case "DELETE":
                return state.filter(post => post.id != action.id)
            case "ADD":
                return [...state, action.data]
            case "SEARCH":
                if (action.search === "id") {
                    return state.filter(post => post.id == action.data)
                }
                return state.filter(post => post.title.includes(action.data));

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
            getData();
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
                dispatch({ type: "ADD", data: data });
            });
        updateId();
    }

    const deletePost = async (taskId) => {
        await fetch(`http://localhost:3000/posts/${taskId}`, {
            method: 'DELETE',
        })
        dispatch({ type: "DELETE", id: taskId });
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
        reset();
    }

    return (
        <>
            <Select options={searchOptions} onChange={handleChangeSearch} placeholder="Search by..." />

            {display.search == "id" && <form onSubmit={handleSubmit((data) => search(data["search"]))}>
                <input type="text" placeholder="id" {...register("search")} /><br />
                <button type="submit">Search</button> </form>}

            {display.search == "alphabetical" && <input type="text" placeholder="search..." onChange={event => search(event.target.value)} />}
            <button onClick={() => { setDisplay(prevDisplay => { return { ...prevDisplay, add: !prevDisplay.add } }) }}>+</button>
            {display.add && <form onSubmit={handleSubmit(addPost)}>
                <textarea type="text" placeholder="title" {...register("title")} /><br />
                <textarea type="text" placeholder="body" {...register("body")} /><br />
                <button type="submit">Add</button>
            </form>}
            <div> {userPosts.map((post) => {
                return <><div className="posts" key={post.id}><span>Post {post.id}</span>
                    <span className="postTitle">{post.title}</span><span className="btnSpan">
                        <button className="delete" onClick={() => deletePost(post.id)}></button>
                        <button className="update" onClick={() => {
                            if (post.id != currentUpdateId.current) {
                                dispatch({ type: "DISPLAY", id: currentUpdateId.current })
                                currentUpdateId.current = post.id
                            } dispatch({ type: "DISPLAY", id: post.id });
                        }}></button></span>
                </div>
                    {post.update && <form onSubmit={handleSubmit(data => onSubmitUpdate(post.id, data))}>
                        <textarea type="text" placeholder="title" {...register("title")} /><br />
                        <textarea type="text" placeholder="body" {...register("body")} /><br/>
                        <button type="submit">Update</button>
                    </form>
                    }
                </>
            })}
            </div>

        </>
    )
}
export default Posts