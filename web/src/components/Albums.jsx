import React,{useContext,useEffect} from "react";
import{UserContext} from '../App'


const Albums = () => {
    const { user} = useContext(UserContext);
    useEffect(()=>{
        if(user==null){
            navigate('/login')
        }
    },[])
    return(
        <>
        </>
    )
}
export default Albums