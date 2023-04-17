import styled from "styled-components";
import Theme from "../utility/theme";

import GoogleLogo from "../assets/google_logo.svg";
import { useState } from "react";
import { Bubble } from "./input.style";
import { transparentize } from "polished";
import Circler from '../assets/circles.svg';
import BrandImage from '../assets/image.svg';


const ModalWrap = styled.div`
    background: rgba(0,0,0,0.02);
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
    width: 80%;
    max-width: 1000px;
    
    overflow: hidden;
    display: grid;
    grid-template-columns: 3fr 2fr;
    position: relative;
    & .left{
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url(${Circler});
        background-size: 600px;
        background-position: -300px -300px;
        background-repeat: no-repeat;
        /* & .brand{
            position: absolute;
            top:  ${Theme.dimensions.x5};
            left: ${Theme.dimensions.x5};
        } */
        & .info{
            position: absolute;
            bottom:  ${Theme.dimensions.x3};
            left: ${Theme.dimensions.x0};
            text-align: center;
            width: 60%;
            opacity:0.8;
        }
    }
    & .right{
        background-color: ${ transparentize(0.5, Theme.primary.colors.border)};
        & .brandy{
            height: 600px;
            background-image: url(${BrandImage});
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
`;

export const LoginWrapper = styled.div`
    text-align: center;
    padding: ${Theme.dimensions.x10} ${Theme.dimensions.x5};
    & svg.brand {
        height: ${Theme.dimensions.x6};
        margin-bottom: ${Theme.dimensions.x};
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
        <Bubble name={name} />
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