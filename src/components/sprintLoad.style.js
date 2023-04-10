import styled, { css } from "styled-components";
import Theme from "../utility/theme";

export const SprintGroup = styled.div`
    border-radius: ${Theme.secondary.radius};
    border: 1px solid ${Theme.primary.colors.border};
    max-width: 1000px;
    overflow: hidden;
    margin: ${Theme.dimensions.x3} 0;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
    
    & .groupHeader{
        padding: ${Theme.dimensions.x2};
        border-bottom: 1px solid ${Theme.primary.colors.border};
        display: grid;
        align-items: center;
        grid-template-columns: max-content auto max-content max-content max-content;
        grid-gap: ${Theme.dimensions.x2};

        & em{
            font-size: 0.8rem;
            opacity: 0.8;
            display: block;
        }
        & strong{
            font-weight: 600;
            font-size: 1rem;
            text-transform: uppercase;
        }
    }
`;

export const RowGroup = styled.div`
    ${props=> props.disabled && css`
        opacity: 0.2;
        & *{
            pointer-events: none;
            & .memberDelete{
                pointer-events: all;
            }
        }
    `}
`;

export const SprintContainer = styled.div`
    height: calc(100vh - 82px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: ${Theme.dimensions.x5} ${Theme.dimensions.x0};
`;