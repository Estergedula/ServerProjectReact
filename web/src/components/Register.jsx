import React from "react";
import { memo, useState } from "react";



const Register = () => {
    const [regUserDetails, setRegUserDetails] = useState({ userName: '', password: '', verifyPassword: '' })
    const [isExsist,setIsExist]=useState(true)
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "name":
                setRegUserDetails({ ...regUserDetails, userName: value })
                break;
            case "password":
                setRegUserDetails({ ...regUserDetails, password: value })
                break;
            default:
                setRegUserDetails({ ...regUserDetails, verifyPassword: value })
                break;
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`https://jsonplaceholder.typicode.com/db/users/?username=${regUserDetails.userName}`)
            .then(response => {
                console.log(response.status) ;
                if (response.ok) {
                    alert('this user name aleady exist');
                }
                console.log(response.json()) ;
            })
            .then(data => {
                alert(data);
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="user name" name="name" required min={2} pattern="[A-Za-z]{3,}" value={regUserDetails.name} onChange={handleChange} /><br />
                <input type="password" placeholder="password" name="password" required value={regUserDetails.password} onChange={handleChange} /><br />
                <input type="password" placeholder="verify-password" name="verifyPassword" required value={regUserDetails.verifyPassword} onChange={handleChange} />
                <button type="submit">click me!</button><br />
            </form>
        </>
    )
}
export default Register