import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { UserContext } from './UserProvider'
const Login = () => {

    const navigate = useNavigate();
    const { user, setCurrentUser } = useContext(UserContext);

    useEffect(() => {
        if (user != null) {
            navigate(`/home/users/${user.id}`)
        }
    }, [])

    const {
        register,
        handleSubmit,
        reset,
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
                    reset();
                    return;
                }
                reset();
                const currentUser = { username: data[0].username, name: data[0].name, id: data[0].id, email: data[0].email };
                setCurrentUser(currentUser);
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                navigate(`/home/users/${data[0].id}`)
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="user name" {...register("userName", { required: true })} /><br />
            <input type="password" placeholder="password" {...register("password", { required: true })} /><br />
            <button>Log in</button><br />
            <Link to="/register">not registered yet?</Link>
        </form>
    )

}
export default Login