import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import  {UserContext}  from './UserProvider'
import { useForm } from "react-hook-form";
import Select from 'react-select'


const Todos = () => {
    const { user } = useContext(UserContext);
    const [display, setDisplay] = useState({ add: false, search: false })
    const nextTodoId = useRef(0)
    const [currentUpdatedId, setCurrentUpdatedId] = useState()
    const orderOptions = [{ value: "id", label: "id" },
    { value: "completed", label: "completed" },
    { value: "alphabetical", label: "alphabetical" },
    { value: "random", label: "random" }]
    const searchOptions = [{ value: "id", label: "id" },
    { value: "completed", label: "completed" },
    { value: "alphabetical", label: "alphabetical" },
    { value: "all", label: "all" }]
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();
    let initialTodos = {
        todos: [],
        todosDisplay: []
    }

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
                return {
                    todos: state.todos.map((todo) => {
                        if (todo.id == action.data.id) { return action.data; }
                        else { return todo; }
                    }),
                    todosDisplay: state.todosDisplay.map((todo) => {
                        if (todo.id == action.data.id) { return action.data; }
                        else { return todo; }
                    })
                }
            case "START":
                return { todos: action.data, todosDisplay: action.data }
            case "DELETE":
                return {
                    todos: state.todos.filter(todo => todo.id != action.id),
                    todosDisplay: state.todosDisplay.filter(todo => todo.id != action.id)
                }
            case "ADD":
                return { todos: [...state.todos, action.data], todosDisplay: [...state.todosDisplay, action.data] }
            case "SORT":
                switch (action.orderBy) {
                    case "alphabetical":
                        return { ...state, todosDisplay: state.todos.sort((todo1, todo2) => todo1.title > todo2.title ? 1 : -1) }
                    case "completed":
                        return { ...state, todosDisplay: state.todos.sort((todo1, todo2) => todo1.completed < todo2.completed ? 1 : -1) }
                    case "random":
                        return { ...state, todosDisplay: state.todos.sort(() => Math.random() > 0.5 ? 1 : -1) }
                    default:
                        return { ...state, todosDisplay: state.todos.sort((todo1, todo2) => todo1.id - todo2.id) }
                }
            case "SEARCH":
                switch (action.search) {
                    case "id":
                        return { ...state, todosDisplay: state.todos.filter(todo => todo.id == action.data) }
                    case "completed":
                        return { ...state, todosDisplay: state.todos.filter(todo => todo.completed == true) }
                    case "all":
                        return { ...state, todosDisplay: state.todos }
                    default:
                        return { ...state, todosDisplay: state.todos.filter(todo => todo.title.includes(action.data)) }
                }
            default:
                return state;
        }
    }

    const getData = () => {
        fetch(`http://localhost:3000/todos/?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: "START", data: data })
            })

    }
    const [userTodos, dispatch] = useReducer(reducer, initialTodos);



    const getNextId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/todosId`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data.value)
                nextTodoId.current = data.value + 1;
                console.log(nextTodoId.current)
            })
    }


    const updateId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/todosId`, {
            method: 'PATCH',
            body: JSON.stringify({
                value: nextTodoId.current,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        nextTodoId.current = nextTodoId.current + 1;
    }

    const handleChangeOrder = (event) => {
        dispatch({ type: "SORT", orderBy: event.value })
    }

    const handleChangeSearch = (event) => {
        let searchBy = event.value;
        if (searchBy == "completed" || searchBy == "all") {
            dispatch({ type: "SEARCH", search: searchBy })
            setDisplay(prevDisplay => { return { ...prevDisplay, search: searchBy } })
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
    const handleCheckBox = (event, taskId) => {
        fetch(`http://localhost:3000/todos/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed: event.target.checked,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(data => dispatch({ type: "CHANGE", data: data }))
    }


    const deleteTodo = async (taskId) => {
        await fetch(`http://localhost:3000/todos/${taskId}`, {
            method: 'DELETE',
        })
        dispatch({ type: "DELETE", id: taskId });
    }

    const addTodo = (todoTitle) => {
        fetch(`http://localhost:3000/todos`, {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                id: `${nextTodoId.current}`,
                title: todoTitle,
                completed: false

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

    const onSubmitUpdate = (dataInput) => {
        let id = Object.keys(dataInput)[0]
        fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: dataInput[id]
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
            <div className="operations">

                <Select className="select" options={orderOptions} onChange={handleChangeOrder} placeholder="Sort by..." />
                <span>
                    <Select className="select" options={searchOptions} onChange={handleChangeSearch} placeholder="Search by..." />
                    {display.search == "id" && <form onSubmit={handleSubmit((data) => search(data["search"]))}>
                        <input type="text" placeholder="id" {...register("search")} /><br />
                        <button type="submit">Search</button> </form>}
                    {display.search == "alphabetical" && <input type="text" placeholder="search..." onChange={event =>
                        search(event.target.value)} />}
                </span>

                <span>
                    <button onClick={() => { setDisplay(prevDisplay => { return { ...prevDisplay, add: !prevDisplay.add } }) }}>+</button>
                    {display.add &&
                        <form onSubmit={handleSubmit(data => { addTodo(data["title"]); reset(); })}>
                            <textarea type="text" placeholder="title" {...register("title")} /><br />
                            <button type="submit">Add</button>
                        </form>}
                </span>

            </div>
            {console.log(userTodos)}
            {userTodos.todosDisplay.map((todo) => {
                return <>
                    <div className="tasks" key={todo.id}>

                        <span className="idSpan">task Id:{todo.id}</span>
                        <span>{todo.title}</span>
                        <span className="btnSpan"> <input type="checkbox" checked={todo.completed} onChange={(event) => handleCheckBox(event, todo.id)} />

                            <button className="delete" onClick={() => deleteTodo(todo.id)}></button>
                            <button className="update" onClick={() => {
                                currentUpdatedId == todo.id ? setCurrentUpdatedId(null) : setCurrentUpdatedId(todo.id)
                            }}></button>
                        </span>

                    </div>
                    {currentUpdatedId == todo.id &&
                        <form onSubmit={handleSubmit(onSubmitUpdate)}>
                            <textarea type="text" placeholder="title" {...register(`${todo.id}`)} /><br />
                            <button type="submit">Update</button>
                        </form>}
                </>
            })}
        </>
    )
}
export default Todos