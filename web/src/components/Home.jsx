import React from "react";
import { memo, useState } from "react";


 const Home = (props) =>{
    return(
        <>
            Here is Home page
            <br />
            {props.x}
        </>
    )
}
export default memo(Home)