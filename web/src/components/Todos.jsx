import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../App'


const Todos = () => {
    const [userTodos, setUserTodos] = useState([])
    const { user } = useContext(UserContext);
    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            fetch(`http://localhost:3000/todos/?userId=${user.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setUserTodos(data)
                })
        }, [])

    const handleCheck = (event, taskId) => {
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
            .then(data => changeTodoComplete(data))
    }

    const deleteTodo = async (taskId) => {
        await fetch(`http://localhost:3000/todos/${taskId}`, {
            method: 'DELETE',
        })
        deleteTodoFromState(taskId)
    }


    const deleteTodoFromState = (taskId) => {
        let updateUserTodos = userTodos.filter(todo => todo.id != taskId)
        setUserTodos(updateUserTodos)
    }
    const changeTodoComplete = (taskId) => {
        let updateUserTodos = userTodos.map(todo => {
            if (todo.id == taskId) {
                return { ...todo, complete: !todo.complete }
            }
            return todo
        })
    }
    return (
        <>
            {userTodos.map((todo) => {
                return <div className="tasks"><span className="idSpan">task Id:{todo.id}</span>
                    <span>{todo.title}</span>
                    <span className="btnSpan"> <input type="checkbox" checked={todo.completed} onChange={(event) => handleCheck(event, todo.id)} />
                        <button className="delete" onClick={() => deleteTodo(todo.id)}></button>
                        <button className="update" onClick={() => updateTodo(todo.id)}></button></span>
                </div>
            })}
        </>
    )
}
export default Todos