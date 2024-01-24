import React, { useContext, useEffect, useState, useRef, useReducer } from "react";
import { UserContext } from '../UserProvider'
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import './Photos.css'

const Photos = () => {
    const { id } = useParams()
    const location = useLocation()
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const nextPhoto = useRef(0)
    const [addDisplay, setAddDisplay] = useState(false)
    const [selectedUpdateId, setSelectedUpdateId] = useState()
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            fetch(`http://localhost:3000/photos/?albumId=${id}&_limit=10`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: "START", data: data })
                })
            getNextId();
        }, [])


    const reducer = (state, action) => {
        switch (action.type) {
            case "UPDATE":
                return state.map((photo) => {
                    if (photo.id == action.data.id) { return action.data; }
                    else { return photo; }
                })
            case "START":
                return action.data;
            case "DISPLAY":
                return [...state, ...action.data];
            case "DELETE":
                return state.filter(photo => photo.id != action.id);
            case "ADD":
                return [...state, action.data];
            default:
                return state;
        }
    }
    const [currentPhotos, dispatch] = useReducer(reducer, []);

    const getData = () => {
        let photosArrLength = currentPhotos.length;
        fetch(`http://localhost:3000/photos/?albumId=${id}&_start=${photosArrLength}&_end=${photosArrLength + 10}`)
            .then(response => response.json())
            .then(data => {
                dispatch({ type: "DISPLAY", data: data })
            })
    }

    const getNextId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/photosId`)
            .then(response => response.json())
            .then(data => {
                nextPhoto.current = data.value + 1;
            })
    }

    const updateId = () => {
        fetch(`http://localhost:3000/ContinuousNumber/photosId`, {
            method: 'PATCH',
            body: JSON.stringify({
                value: nextPhoto.current,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        nextPhoto.current = nextPhoto.current + 1;
    }

    const addPhoto = (photoData) => {
        fetch(`http://localhost:3000/photos`, {
            method: 'POST',
            body: JSON.stringify({
                albumId: id,
                id: `${nextPhoto.current}`,
                title: photoData.title,
                url: photoData.url,
                thumbnailUrl: photoData.thumbnailUrl
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(data => {
                reset()
                dispatch({ type: "ADD", data: data });
            });
        updateId();
    }

    const deletePhoto = async (photoId) => {
        await fetch(`http://localhost:3000/photos/${photoId}`, {
            method: 'DELETE',
        })
        dispatch({ type: "DELETE", id: photoId });
    }

    const onSubmitUpdate = (photoId, photoData) => {
        fetch(`http://localhost:3000/photos/${photoId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: photoData.title,
                url: photoData.url,
                thumbnailUrl: photoData.thumbnailUrl
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json())
            .then(data => {
                dispatch({ type: "UPDATE", data: data })
            })
    }

    return (
        <>
            <h2>{location.state}</h2>
            <button onClick={() => { setAddDisplay(display => !display) }}>Add photo</button>
            {addDisplay &&
                <form onSubmit={handleSubmit(addPhoto)}>
                    <textarea type="text" placeholder="title" {...register("title", { required: true })} /><br />
                    <input type="url" placeholder="url" {...register("url", { required: true })} /><br />
                    <input type="url" placeholder="thumbnailUrl" {...register("thumbnailUrl", { required: true })} /><br />
                    <button type="submit">Add</button>
                </form>
            }
            <div className="imgs">{currentPhotos.map((photo) => {
                return <span key={photo.id}>
                    <p className="photoTitle"><b>Title: </b>{photo.title}</p>
                    {selectedUpdateId === photo.id ?
                        <form onSubmit={handleSubmit(data => onSubmitUpdate(photo.id, data))}>
                            <textarea type="text" defaultValue={photo.title} placeholder="title" {...register("title", { required: true })} /><br />
                            <input type="url" placeholder="url" defaultValue={photo.url}{...register("url", { required: true })} /><br />
                            <input type="url" placeholder="thumbnailUrl" defaultValue={photo.thumbnailUrl}{...register("thumbnailUrl", { required: true })} /><br />
                            <button type="submit">Update</button>
                        </form> :
                        <img src={photo.thumbnailUrl} />
                    }
                    <span className="photoBtns">
                        <button className="delete" onClick={() => deletePhoto(photo.id)}></button>
                        <button className="update" onClick={() => {
                            selectedUpdateId == photo.id ? setSelectedUpdateId(null) : setSelectedUpdateId(photo.id)
                        }}></button>
                    </span>
                </span>
            })}
            </div>
            <button onClick={() => getData()}>Show more</button>
        </>
    )
}

export default Photos;