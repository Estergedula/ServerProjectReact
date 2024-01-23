import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import  {UserContext}  from './UserProvider'

export default function Start(){
   const { user } = useContext(UserContext);
   const navigete = useNavigate()
   useEffect(
    ()=>{
        if (user===null) {
            navigete("/login")   
        }
        navigete(`/home/users/${user.id}`)
    }
   )
    return (<></>
    )
}