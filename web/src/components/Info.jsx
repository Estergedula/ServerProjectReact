import React from "react";
import { json, useParams } from "react-router-dom";
import { memo, useState, useEffect } from "react";

const Info = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    Object.keys(currentUser).forEach((key, index)=> {})
    return (
        <>
       { StringifyObject()}
        </>
    )
}

export default Info