import React from "react";
import { json, useParams } from "react-router-dom";
import { memo, useState, useEffect } from "react";

const Info = () => {
    const {currentUser,} = useContext(UserContext);
    const print = (myObject) => {
        return Object.keys(myObject).map((key) => (typeof myObject[key] === 'object' ?
            <div><p>{key}</p> {print(myObject[key])}</div> :
            <p>{key}: {myObject[key]}</p>))
    }
    return (
        <>
            <div>
                {print(currentUser)}
            </div>
        </>
    )
}

export default Info