import React, { useContext } from "react";
import {  useEffect } from "react";
import  {UserContext}  from './UserProvider'
const Info = () => {
    const { user, setCurrentUser } = useContext(UserContext);
    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            fetch(`http://localhost:3000/users/${user.id}`)
                .then(response => response.json())
                .then(data => {
                    setCurrentUser(data)
                })
            return () => setCurrentUser(JSON.parse(localStorage.getItem("currentUser")))
        }, [])
        
    const print = (myObject) => {
        let keysArray=Object.keys(myObject)
        keysArray.splice(6,1)
        return keysArray.map((key,index) => (typeof myObject[key] === 'object' ?
            <div key={index}><p className="label">{key}</p> {print(myObject[key])}</div> :
            <p key={index}><span className="label">{key}:</span> {myObject[key]}</p>))
    }

    return (
            <div>
                {print(user)}
            </div>
    )
}

export default Info