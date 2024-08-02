import React from "react";
import Nav from "./Nav";
import axios from "axios";

function FirstPage() {
    console.log(axios.defaults.headers.common.Authorization);
    return(
        <>
            <Nav/>
            <h1 style={ {flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }>public Class Dev</h1>
            <p style={ {flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }>소개</p>
        </>
    )
}

export default FirstPage;