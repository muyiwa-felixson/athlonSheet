import styled, { css } from "styled-components";
import Theme from "../utility/theme";

export const SprintGroup = styled.div`
    border-radius: ${Theme.secondary.radius} ${Theme.secondary.radius} 0 0;
    border: 1px solid ${Theme.primary.colors.border};
    border-bottom: none ;
    max-width: 1000px;
    margin: ${Theme.dimensions.x2} 0;
    
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