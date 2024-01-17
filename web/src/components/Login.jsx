import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import { memo, useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            userName: '',
            password: ''
        }
    });

    const onSubmit = (userDetails) => {
        fetch(`http://localhost:3000/users/?username=${userDetails.userName}&website=${userDetails.password}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (!data.length) {
                    alert('ERROR!');
                    return;
                }
                const user ={username:data[0].username,id:data[0].id};
                localStorage.setItem("currentUser", JSON.stringify(user));
                navigate(`/home/users/${data[0].id}`)
            })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text"  placeholder="user name" {...register("userName")} /><br />
            <input type="password"  placeholder="password" {...register("password")} /><br />
            <button>click me!</button><br />
            <Link to="/register">not registered yet?</Link>
        </form>
    )

}
export default Login