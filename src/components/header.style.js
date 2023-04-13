import styled, { css } from "styled-components";
import Theme from "../utility/theme";


export const Header = styled.div`
    height: ${Theme.dimensions.x10};
    border-bottom: 1px solid ${Theme.primary.colors.border};
    
    & .cage{
        align-items: center;
        max-width: 1440px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: auto max-content max-content;
        grid-gap: ${Theme.dimensions.x2};
        padding: ${Theme.dimensions.x2} 0;
    }

    ${props=> props.foot && css`
    border-top: 1px solid ${Theme.primary.colors.border};
    border-bottom: none;
    position: fixed;
    bottom: 0;
    z-index: 3;
    width: 100%;
    background: ${Theme.primary.colors.surface};
    box-shadow: 0 -5px 25px rgba(0,0,0,0.05);
    `}

    & .topbrand{
        height: ${Theme.dimensions.x6};
    }
`;