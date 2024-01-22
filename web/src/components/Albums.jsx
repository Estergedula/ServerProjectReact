import React, { useContext, useEffect, useRef, useReducer,useState } from "react";
import { UserContext } from '../App'
import Select from 'react-select'
import { useForm } from "react-hook-form";


const Albums = () => {
    const { user } = useContext(UserContext);
    const nextAlbumId = useRef(0)
    const [display, setDisplay] = useState({ add: false, search: false })
    const searchOptions = [{ value: "id", label: "id" },
    { value: "alphabetical", label: "alphabetical" },
    { value: "all", label: "all" }]
    let initialAlbums = []
    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            getData()
            getNextId();
        }, [])

    const reducer = (state, action) => {
        switch (action.type) {
            case "START":
                return action.data;
            case "DELETE":
                return state.filter(album => album.id != action.id)
            case "ADD":
                return [...state, action.data]
            case "SEARCH":
                if (action.search === "id") {
                    return state.filter(album => album.id == action.data)
                }
                return state.filter(album => album.title.includes(action.data));

            default:
                return state;
        }
    }

    const getData = () => {
        fetch(`http://localhost:3000/albums/?userId=${user.id}`)
        .then(response => response.json())
        .then(data => {
            dispatch({ type: "START", data: data })
        })
    }
    const [userAlbums, dispatch] = useReducer(reducer, initialAlbums);



    const getNextId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/albumsId`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                nextAlbumId.current = data.value + 1;
            })
    }

    const handleChangeSearch = (event) => {
        let searchBy = event.value;
        if (searchBy === "all") {
            getData();
        }
        else {
            setDisplay(prevDisplay => { return { ...prevDisplay, search: searchBy } })
        }
    }
    return (
        <>
         <div className="operations">
                <span><Select className="select" options={searchOptions} onChange={handleChangeSearch} placeholder="Search by..." />

                    {display.search == "id" && <form onSubmit={handleSubmit((data) => search(data["search"]))}>
                        <input type="text" placeholder="id" {...register("search")} /><br />
                        <button type="submit">Search</button> </form>}

                    {display.search == "alphabetical" && <input type="text" placeholder="search..." onChange={event => search(event.target.value)} />}</span>
                <span> <button onClick={() => { setDisplay(prevDisplay => { return { ...prevDisplay, add: !prevDisplay.add } }) }}>+</button>
                    {display.add && <form onSubmit={handleSubmit(addalbum)}>
                        <textarea type="text" placeholder="title" {...register("title")} /><br />
                        <button type="submit">Add</button>
                    </form>}</span>

            </div>
         {userAlbums.map((album) => {
                return <div className="albums" key={album.id}><span className="idSpan">album Id:{album.id}</span>
                    <span>{album.title}</span>
                </div>
            })}
        </>
    )
}
export default Albums