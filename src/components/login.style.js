import styled from "styled-components";
import Theme from "../utility/theme";

import GoogleLogo from "../assets/google_logo.svg";
import { useState } from "react";


const ModalWrap = styled.div`
    background: rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100vh;
    width: 100vw;
    color: #757575;
`;

const LoginModal = styled.div`
    border-radius: ${Theme.secondary.radius};
    background: ${Theme.primary.colors.surface};
    width: 60%;
    max-width: 500px;
    padding: ${Theme.dimensions.x5};
`;

export const LoginWrapper = styled.div`
    text-align: center;
    & svg.brand {
        height: ${Theme.dimensions.x6};
    }
`

const ProfileWrapper = styled.div`
    position: relative;
    display: inline-grid;
    grid-template-columns: max-content auto max-content;
    border: 1px solid ${Theme.primary.colors.border};
    border-radius: ${Theme.primary.radius};
    padding: ${Theme.dimensions.x1};
    grid-gap: ${Theme.dimensions.x1};
    font-size: 0.8rem;
    align-items: center;
    text-align: left;
    cursor: pointer;

    &:hover{
        /* border: 1px solid ${Theme.primary.colors.black}; */
    }
    & img{
        height: ${Theme.dimensions.x3};
        width: ${Theme.dimensions.x3};
        object-fit: cover;
        border-radius: 50%;
    }
    & strong{
        display: block;
        color: ${Theme.primary.colors.black};
    }

    & .drop{
        border: 1px solid ${Theme.primary.colors.border};
        border-radius: ${Theme.primary.radius};
        padding: ${Theme.dimensions.x2};
        position: absolute;
        top: 50px;
        right: 0;
        box-shadow: 1px 4px 12px rgba(0,0,0,0.1);
        display: ${props=> props.show ? 'block' : 'none'};
        background: ${Theme.primary.colors.surface};
        z-index: 100;

        & ul{
            margin: 0;
            padding: 0;

            & li{
                list-style: none;
                padding-bottom: ${Theme.dimensions.x1};
                cursor: pointer;
                &:hover{
                    color: ${Theme.primary.colors.black};
                }
            }
        }
    }
`;

export const GoogleButton = styled.button`
    border-radius: ${Theme.secondary.radius};
    display: inline-grid;
    grid-template-columns: max-content auto max-content;
    border: none;
    border-radius: ${Theme.primary.radius};
    padding: ${Theme.dimensions.x2} ${Theme.dimensions.x2};
    grid-gap: ${Theme.dimensions.x1};
    font-weight: 400;
    font-size: 0.9rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    cursor: pointer;
    background: ${Theme.primary.colors.google};
`;

export const GoogleProfile = ({picture, name, email, logOut}) => {
    const [drop, setDrop] = useState(false);
    return <ProfileWrapper onClick={()=> setDrop(!drop)} show={drop}>
        <img src={picture} alt="user image" />
        <div>
            <strong>{name}</strong>
<span>{email}</span>
        </div>
        <img src={GoogleLogo} alt="google logo" />
        <div className="drop">
            <ul>
                <li onClick={logOut}>Sign out</li>
                {email}
            </ul>
        </div>
    </ProfileWrapper>

}

export const Modal = props => {
   return <ModalWrap>
        <LoginModal>{props.children}</LoginModal>
        {props.attache}
    </ModalWrap>
}