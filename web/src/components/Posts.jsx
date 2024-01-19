import React, { useContext, useEffect,useState } from "react";
import { UserContext } from '../App'


const Posts = () => {
    const [userPosts, setUserPosts] = useState([])
    const { user } = useContext(UserContext);
    useEffect(
        () => {
            if (user == null) {
                navigate('/login')
            }
            fetch(`http://localhost:3000/posts/?userId=${user.id}`)
                .then(response => response.json())
                .then(data => {
                    setUserPosts(data)
                })
        }, [])
    return (
        <>
        <div> {userPosts.map((post) => {
                return <div className="posts"><span>Post {post.id}</span>
                    <span>{post.title}</span></div>
            })}</div>
           
        </>
    )
}
export default Posts