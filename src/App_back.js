import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from "js-cookie";

function App() {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState([]);

    const onSuccess = (googleUser) => {
        console.log(googleUser);
        // console.log('Logged in successfully!');
        // console.log('User details:', googleUser.getBasicProfile());
    };

    const onFailure = (response) => {
        alert(response);
    }
    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
                <div>
                    <GoogleLogin 
                    onSuccess={onSuccess} onError={onFailure} useOneTap 
                    cookiePolicy={'single_host_origin'}
/>
                </div>
        </div>
    );
}
export default App;