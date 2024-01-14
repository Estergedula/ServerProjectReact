import React from "react";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import Details from "./Details";



const Register = () => {

  const [isExsist, setIsExist] = useState(true)
  const [user, setUser] = useState({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (userDetails) => {
    if (userDetails.password !== userDetails.verifyPassword) {
      alert('error. password is not defined')
      return;
    }
    fetch(`http://localhost:3000/users/?username=${userDetails.userName}`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.length) {
          alert('this user name aleady exist');
          reset();
          return;
        }
        setIsExist(false);
        setUser(userDetails);
      })
  }
  return (
    <>
      {isExsist ? <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="user name" name="userName" {...register("userName", {
          required: " user name is required.",
          pattern: {
            value:/^[a-zA-Z ]*$/,
            message: "User name cannot contain a white space"
          },
          minLength: {
            value: 2,
            message: "user name should be at-least 2 characters."
          }
        })} /><br />
        {errors.userName && (
          <p className="errorMsg">{errors.userName.message}</p>)}
        <input type="password" placeholder="password" name="password" {...register("password", {
          required: "Password is required.",
          minLength: {
            value: 6,
            message: "Password should be at-least 6 characters."
          }
        })} /><br />
        {errors.password && (
          <p className="errorMsg">{errors.password.message}</p>)}
        <input type="password" placeholder="verify-password" name="verifyPassword" {...register("verifyPassword", {
          required: "verify-password is required.",
          minLength: {
            value: 6,
            message: "verify-password should be at-least 6 characters."
          }
        })} />
        {errors.verifyPassword && (
          <p className="errorMsg">{errors.verifyPassword.message}</p>)}<br />
        <button type="submit">click me!</button>
      </form> :
        <Details user={user} />}
    </>
  )
}
export default Register