import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import { UserContext } from '../App'
import { useForm } from "react-hook-form";

const Todos = () => {
    const { user } = useContext(UserContext);
    const [displayAdd, setDisplayAdd] = useState(false)
    const nextTodoId = useRef(0)
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();
    let initialTodos = []

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
                return state.map((todo) => {
                    if (todo.id === action.id) {
                        return { ...todo, completed: !todo.completed };
                    } else {
                        return todo;
                    }
                });
            case "START":
                return action.data;
            case "DELETE":
                return state.filter(todo => todo.id != action.id)
            case "DISPLAY":
                return state.map((todo) => {
                    if (todo.id === action.id) {
                        return { ...todo, update: !todo.update };
                    } else {
                        return todo;
                    }
                });
            case "UPDATE":
                return state.map((todo) => {
                    if (todo.id === action.id) {
                        return { ...todo, title: action.data };
                    } else {
                        return todo;
                    }
                });
            case "ADD":
                return [...state, action.data]
            default:
                return state;
        }
    }

    const getData = () => {
        fetch(`http://localhost:3000/todos/?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
                return data.map(todo => { return { ...todo, update: false } })
            })
            .then(initialTodos => { dispatch({ type: "START", data: initialTodos }) })

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
            .then(data => dispatch({ type: "COMPLETE", id: data.id }))
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
                console.log(data)
                dispatch({ type: "ADD", data: data });
            });
        updateId();
    }

    const onSubmitUpdate = (data) => {
        let id = Object.keys(data)[0]
        dispatch({ type: "UPDATE", data: data[id], id: id });
        reset();
    }
    return (
        <>
            <div id="operations"><button onClick={() => { setDisplayAdd(display => !display) }}>+</button>
                {displayAdd && <form onSubmit={handleSubmit(data => { reset(); addTodo(data["title"]) })}>
                    <textarea type="text" placeholder="title" {...register("title")} /><br />
                    <button type="submit">Add</button>
                </form>}</div>
            {userTodos.map((todo) => {
                return <><div className="tasks" key={todo.id}><span className="idSpan">task Id:{todo.id}</span>
                    <span>{todo.title}</span>
                    <span className="btnSpan"> <input type="checkbox" checked={todo.completed} onChange={(event) => handleCheckBox(event, todo.id)} />
                        <button className="delete" onClick={() => deleteTodo(todo.id)}></button>
                        <button className="update" onClick={() => { dispatch({ type: "DISPLAY", id: todo.id }); }}></button></span>
                </div>
                    {todo.update && <form onSubmit={handleSubmit(onSubmitUpdate)}>
                        <textarea type="text" placeholder="title" {...register(`${todo.id}`)} /><br />
                        <button type="submit">Update</button>
                    </form>}
                </>
            })}
        </>
    )
}
export default Todos