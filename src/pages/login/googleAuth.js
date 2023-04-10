import React, {useEffect} from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from "js-cookie";
import { UserContext } from '../../App';
import GoogleLogo from "../../assets/google_logo.svg";
import { FiArrowRight } from "react-icons/fi";
import { GoogleButton } from '../../components/login.style';


export const GoogleAuth = () => {
const UserData = React.useContext(UserContext);
const logOut = UserData.logOut;

const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      if(UserData.domain.get.includes(codeResponse.hd)){
        UserData.user.set(codeResponse);
        UserData.loginStatus.set('logged in');
        Cookies.set("userDetails", JSON.stringify(codeResponse), { expires: 3 });
      } else {
        console.log('Unaccepted Domain:');
        UserData.loginStatus.set('invalid domain');
        logOut();
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      UserData.loginStatus.set(null);
      logOut();
    },
    accessType: 'offline',
    prompt: 'consent'
});

useEffect(
    () => {
        // console.log("Current User in cookie", UserData.user.get);
        if (UserData.user.get) { 
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${UserData.user.get.access_token},expires_in=10000`, {
                    headers: {
                        Authorization: `Bearer ${UserData.user.get.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log(UserData.user.get);
                    if(res.status === 200){
                        UserData.profile.set(res.data);
                    } else {
                        UserData.loginStatus.set(null);
                        logOut();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    UserData.loginStatus.set(null);
                    logOut();
                });
        }
    },
    [ UserData.user.get ]
);
    return <><GoogleButton onClick={() => login()}><img src={GoogleLogo} /> <span>Sign in with google</span> <FiArrowRight /></GoogleButton></>
}

// log out function to log the user out of google and set the profile array to null
