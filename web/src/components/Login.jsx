import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import { memo, useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = (userDetails) => {
        fetch(`http://localhost:3000/users/?username=${userDetails.userName}&website=${userDetails.password}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (!data.length) {
                    alert('ERROR!');
                    reset();
                    return;
                }
                reset();
                saveLockalStorage(data)
                navigate('/home')
            })
    }
    const saveLockalStorage = (userData) => {
        let users;
        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"));
            if(!users.filter(user=>user.username===userData.username).length){
                return;
            } 
        }
        else{
            users=[]
        }
        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));
      }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" name="userName" placeholder="user name" {...register("userName")} /><br />
            <input type="password" name="password" placeholder="password" {...register("password")} /><br />
            <button>click me!</button><br />
            <Link to="/register">not registered yet?</Link>
        </form>
    )

}
export default Login