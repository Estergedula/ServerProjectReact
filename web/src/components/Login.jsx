import React from "react";
import { Link } from 'react-router-dom'
import { memo, useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {
    const [isExist, setIsExist] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (userDetails) => {
        fetch(`http://localhost:3000/users/?username=${userDetails.userName}`)
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                if (data.length && data.website === userDetails.password) {

                }
            })

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