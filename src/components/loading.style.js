import styled, {keyframes} from "styled-components";
import Theme from "../utility/theme";

const scrollDown = keyframes`
    0% {
      top: 15px;
      height: 4px;
      opacity: 1;
    }
    33% {
      top: 15px;
      height: 40px;
    }
    66% {
      top: 50px;
      height: 10px;
      opacity: 1;
    }
    100% {
      top: 56px;
      height: 4px;
      opacity: 0;
    }
`;

export const Loader = styled.div`
    width: 48px;
    height: 78px;
    position: relative;
    box-sizing: border-box;
    border: 2px solid${Theme.primary.colors.black};
    margin: 20% auto;
    border-radius: 50% 50% 50% 50% / 25% 25% 25% 25%;
    &:before{
        content: "";
        position: absolute;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: ${Theme.primary.colors.black};
        border-radius: 10px;
        animation: ${scrollDown} 1.5s linear infinite;
    }
`;


