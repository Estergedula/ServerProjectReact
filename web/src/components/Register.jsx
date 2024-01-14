import React from "react";
import { memo, useState } from "react";
import Details from "./Details";



const Register = () => {
    const [regUserDetails, setRegUserDetails] = useState({ userName: '', password: '', verifyPassword: '' })
    const [isExsist,setIsExist]=useState(true)
    const {
        register,
        handleSubmit,
      } = useForm();
    
    const handleChange = (event) => {
        const { name, value } = event.target;
                setRegUserDetails({ ...regUserDetails, [name]: value })
    }
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     alert(regUserDetails.userName)
    //     fetch(`http://localhost:3000/users/?username=${regUserDetails.userName}`)
    //         .then(response => {
    //             // console.log(response.status) ;
    //             // if (response.ok) {
    //             //     alert('this user name aleady exist');
    //             // }
    //             // setIsExist(false) ;
    //             return response.json()
    //         })
    //         .then(data => {
    //             debugger
    //             if(data.length){
    //                 alert('this user name aleady exist');
    //             }
    //             console.log(data);
    //         })
    //         .catch(error => {
    //             // Handle any errors
    //             console.error('Error:', error);
    //         });
    // }
    return (
        <>
           {isExsist? <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="user name" name="name" {...register("name", {
              required: true,
              pattern: ".{2,}"
            })} pattern=".{2,}" value={regUserDetails.name} onChange={handleChange} /><br />
                <input type="password" placeholder="password" name="password" required value={regUserDetails.password} onChange={handleChange} /><br />
                <input type="password" placeholder="verify-password" name="verifyPassword" required value={regUserDetails.verifyPassword} onChange={handleChange} />
                <button type="submit">click me!</button><br />
            </form>:
            <Details/>}
        </>
    )
}
export default Register