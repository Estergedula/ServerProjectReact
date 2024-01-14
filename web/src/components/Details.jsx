import React from "react";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
const Details = (props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

   
    //   "address": {
    //     "street": "Kulas Light",
    //     "suite": "Apt. 556",
    //     "city": "Gwenborough",
    //     "zipcode": "92998-3874",
    //     "geo": {
    //       "lat": "-37.3159",
    //       "lng": "81.1496"
    //     }
    //   },
    //   "phone": "1-770-736-8031 x56442",
    //   "website": "hildegard.org",
    //   "company": {
    //     "name": "Romaguera-Crona",
    //     "catchPhrase": "Multi-layered client-server neural-net",
    //     "bs": "harness real-time e-markets"
    const onSubmit=(userDetails)=>{
        console.log(userDetails)
    }
    return(
           <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Name" name="name" {...register("name", {
          required: "name is required.",
          pattern: {
            value: /^[A-Z][a-z/s]*$/,
            message: "name cannot contain numbers"
          },
          minLength: {
            value: 2,
            message: "user name should be at-least 2 characters."
          }
        })} /><br />
        {errors.name && (
          <p className="errorMsg">{errors.name.message}</p>)}
        <input type="email" placeholder="Email" name="email" {...register("email", {
          required: "Email is required",
        })} /><br />
        {errors.email && (
          <p className="errorMsg">{errors.email.message}</p>)}
          <label htmlFor="address">address:</label><br/>
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
      </form>
    )
}

export default Details