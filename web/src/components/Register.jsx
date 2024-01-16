import React, { useRef } from "react";
import { memo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";



const Register = () => {

  const [isExsist, setIsExist] = useState(true)
  const [user, setUser] = useState({})
  const nextUserId = useRef(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();


  useEffect(() => {
    fetch(`http://localhost:3000/ContinuousNumber/usersId`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        nextUserId.current = data.value + 1;
      })
  }
    , [])


  const updateId = () => {
    fetch(`http://localhost:3000/ContinuousNumber/usersId`, {
      method: 'PATCH',
      body: JSON.stringify({
        value: nextUserId.current,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }


  const signUp = (userDetails) => {
    console.log(userDetails)
    if (userDetails.password !== userDetails.verifyPassword) {
      alert('error. password is not defined')
      reset();
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
        reset();
      })
  }


  const userData = (moreDetails) => {
    fetch(`http://localhost:3000/users`, {
      method: 'POST',
      body: JSON.stringify({
        id: nextUserId.current++,
        name: moreDetails.name,
        username: user.username,
        email: moreDetails.email,
        address: {
          street: moreDetails.street,
          suite: moreDetails.suite,
          city: moreDetails.city,
          zipcode: moreDetails.zipcode,
          geo: {
            lat: moreDetails.lat,
            lng: moreDetails.lng
          }
        },
        "phone": moreDetails.phone,
        "website": moreDetails.website,
        "company": {
          "name": moreDetails.name,
          "catchPhrase": moreDetails.catchPhrase,
          "bs": moreDetails.bs
        }
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(data => saveLockalStorage(data));
    updateId();
  }

const saveLockalStorage=(userData)=>{
  debugger
  let users=localStorage.getItem("users")?JSON.parse(localStorage.getItem("users")):[];
  users.push(userData);
  localStorage.setItem("users",JSON.stringify(users))
}

  return (
    <>
      {isExsist ? <form onSubmit={handleSubmit(signUp)}>
        <input type="text" placeholder="user name" name="userName" {...register("username", {
          required: " user name is required.",
          pattern: {
            value: /^[a-zA-Z]*$/,
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
        <input type="password" placeholder="verify-password" name="verify-password" {...register("verifyPassword", {
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
        <form onSubmit={handleSubmit(userData)}>
          <input type="text" placeholder="Name" name="name" {...register("name", {
            required: "name is required.",
            pattern: {
              value: /^[a-zA-Z/s]*$/,
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
          <label >address:</label><br />
          <input type="text" placeholder="street" {...register("street")} />
          <input type="text" placeholder="suite"  {...register("suite")} />
          <input type="text" placeholder="city" name="city" {...register("city", {
            required: "City is required",
          })} />
          {errors.city && (
            <p className="errorMsg">{errors.city.message}</p>)}
          <input type="text" placeholder="zipcode" name="zipcode" {...register("zipcode", {
            pattern: {
              value: /^[0-9-]+$/,
              message: 'Please enter only digits',
            }
          })
          } />
          {errors.zipcode && (
            <p className="errorMsg">{errors.zipcode.message}</p>)}<br />
          <label >geo:</label><br />
          <input type="text" placeholder="lat" name="lat" {...register("lat", {
            pattern: {
              value: /^[0-9-]+$/,
              message: 'Please enter only digits',
            }
          })
          } />
          {errors.lat && (
            <p className="errorMsg">{errors.lat.message}</p>)}
          <input type="text" placeholder="lng" name="lng" {...register("lng", {
            pattern: {
              value: /^[0-9-]+$/,
              message: 'Please enter only digits',
            }
          })
          } />
          {errors.lng && (
            <p className="errorMsg">{errors.lng.message}</p>)}<br />
          <input type="text" placeholder="phone number" name="phoneNumber" {...register("phoneNumber", {
            required: "Phone number is required.",
            pattern: {
              value: /^[0-9-]+$/,
              message: 'Please enter only digits',
            }
            , minLength: {
              value: 9,
              message: 'phone number should be at-least 9 digits.'
            }
          })
          } />
          {errors.phoneNumber && (
            <p className="errorMsg">{errors.phoneNumber.message}</p>)}<br />
          <label htmlFor="company">company</label><br />
          <input type="text" name="company" placeholder="name of company" {...register("companyName", {
            required: "Name of company is required."
          })} />
          {errors.companyName && (
            <p className="errorMsg">{errors.companyName.message}</p>)}
          <input type="text" placeholder="catchPhrase"  {...register("catchPhrase")} />
          <input type="text" placeholder="bs"  {...register("bs")} />
          <br />
          <button type="submit">click me!</button>
        </form>}
    </>
  )
}
export default Register