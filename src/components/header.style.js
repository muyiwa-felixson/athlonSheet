import styled, { css } from "styled-components";
import Theme from "../utility/theme";


export const Header = styled.div`
    height: ${Theme.dimensions.x10};
    border-bottom: 1px solid ${Theme.primary.colors.border};
    display: grid;
    grid-template-columns: auto max-content max-content;
    grid-gap: ${Theme.dimensions.x2};
    padding: ${Theme.dimensions.x2} ${Theme.dimensions.x5};
    align-items: center;

    ${props=> props.foot && css`
    border-top: 1px solid ${Theme.primary.colors.border};
    border-bottom: none;
    `}

    & .topbrand{
        height: ${Theme.dimensions.x6};
    }
`;