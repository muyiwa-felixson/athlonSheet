import { darken, transparentize } from "polished";
import styled from "styled-components";
import Theme from "../utility/theme";


export const Warning = styled.div`
    height: ${Theme.dimensions.x10};
    border: 1px solid ${transparentize(0.8,Theme.primary.colors.google)};
    background: ${transparentize(0.9,Theme.primary.colors.google)};
    border-radius: ${Theme.primary.radius};
    display: grid;
    grid-template-columns: auto max-content;
    padding: ${Theme.dimensions.x2};
    align-items: center;
    color: ${darken(0.1, Theme.primary.colors.google)};
    width: 60%;
    max-width: 500px;
    margin: ${Theme.dimensions.x2} 0;
`;