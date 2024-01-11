import React from "react";
import { Link } from 'react-router-dom'

const Login = (props) => {
    return(
        <>
            <input type="text" placeholder="your name"/><br />
            <input type="password" placeholder="password"/><br />
            <button>click me!</button><br />
            <Link to = "/register">not registered yet?</Link>
        </>
    )
}
export default memo (Login)