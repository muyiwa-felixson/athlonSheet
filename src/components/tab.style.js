import styled from "styled-components";
import Theme from "../utility/theme";

export const TabItem = styled.span`
    display: inline-flex;
    grid-template-columns: max-content auto;
    grid-gap: ${Theme.dimensions.x1};
    align-items: center;
`;