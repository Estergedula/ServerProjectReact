import React from "react";


const Register=()=>  {
    const [regUserDetails, setRegUserDetails]=useState({userName:'',password:'',verifyPassword:''})
    const handleChange=(event)=>{
        const{name,value}=event.target;
        switch (name) {
            case "name":
                setRegUserDetails({...regUserDetails,userName:value})
                break;
                case "password":
                setRegUserDetails({...regUserDetails,password:value})
                break;
            default:
                setRegUserDetails({...regUserDetails,verifyPassword:value})
                break;
        }
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        fetch('https://jsonplaceholder.typicode.com/db/users/?)
    }
    return(
        <>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="user name" name="name"required min={2} pattern="[A-Za-z]" value={regUserDetails.name} onChange={handleChange}/><br />
            <input type="password" placeholder="password" name="password"required value={regUserDetails.password} onChange={handleChange}/><br />
            <input type="password" placeholder="verify-password" name="verifyPassword"required value={regUserDetails.verifyPassword} onChange={handleChange}/>
            <button type="submit">click me!</button><br/>
            </form>
        </>
    )
} 
export default memo (Register)