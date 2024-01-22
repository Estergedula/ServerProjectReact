import React, { useContext } from "react";
import { json, useParams } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import { UserContext } from '../App'
const Info = () => {
    const { user, setUser } = useContext(UserContext);
    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            fetch(`http://localhost:3000/users/${user.id}`)
                .then(response => response.json())
                .then(data => {
                    setUser(data)
                })
            return () => setUser(JSON.parse(localStorage.getItem("currentUser")))
        }, [])

        
    const print = (myObject) => {
        let keysArray=Object.keys(myObject)
        keysArray.splice(6,1)
        return keysArray.map((key,index) => (typeof myObject[key] === 'object' ?
            <div key={index}><p className="label">{key}</p> {print(myObject[key])}</div> :
            <p><span className="label">{key}:</span> {myObject[key]}</p>))
    }

    return (
        <>
            <div>
                {print(user)}
            </div>
        </>
    )
}

export default Info