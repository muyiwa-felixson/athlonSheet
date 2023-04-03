import styled from "styled-components";
import Theme from "../utility/theme";


export const Header = styled.div`
    height: ${Theme.dimensions.x10};
    border-bottom: 1px solid ${Theme.primary.colors.border};
    display: grid;
    grid-template-columns: max-content auto max-content max-content max-content;
    grid-gap: ${Theme.dimensions.x2};
    padding: ${Theme.dimensions.x2} ${Theme.dimensions.x5};
    align-items: center;

    & .topbrand{
        height: ${Theme.dimensions.x6};
    }
`;