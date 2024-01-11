
import { Link } from 'react-router-dom'
export default function Start(){
   
    return (
        <nav>
            <dl>
                <dt><Link to = "/login">Login</Link></dt>
                <dt><Link to = "/register">Register</Link></dt>
            </dl>
        </nav>
    )
}