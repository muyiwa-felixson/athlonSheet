import { darken, transparentize } from "polished";
import styled from "styled-components";
import Theme from "../utility/theme";


export const Warning = styled.div`
    height: ${Theme.dimensions.x10};
    border: 1px solid ${props=> transparentize(0.8,props.color ? props.color : Theme.primary.colors.google)};
    background: ${props=> transparentize(0.9,props.color ? props.color : Theme.primary.colors.google)};
    border-radius: ${Theme.primary.radius};
    display: inline-grid;
    grid-template-columns: auto max-content;
    padding: ${Theme.dimensions.x2};
    align-items: center;
    color: ${props=> darken(0.1, props.color ? props.color : Theme.primary.colors.google)};
    width: 80%;
    max-width: 1000px;
    text-align: center;
    margin: ${Theme.dimensions.x2} 0;
`;