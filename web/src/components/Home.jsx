import React from "react";
import { useParams } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import Info from "./Info";


const Home = () => {
    const [info, setInfo] = useState(false)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const homeButtons = ["Info", "Todos", "Posts", "Albums", "Logout"]

    useEffect(() => {
        if (!user) {
            navigate('/LogIn')
        }
    }, [])

    const operations = (button) => {
        switch (button) {
            case "Info":
                setInfo(true)
                break;

            default:
                break;
        }
    }
    return (
        <>
            {info ? <Info />:
            <div>{homeButtons.map(button => <button onClick={() => operations(button)}>{button}</button>)}
            </div>}

        </>
    )
}
export default Home