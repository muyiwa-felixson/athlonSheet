import { transparentize } from "polished";
import styled from "styled-components";
import Theme from "../utility/theme";


export const GroupCard = styled.div`
    border: 1px solid ${Theme.primary.colors.border};
    border-radius: ${Theme.secondary.radius};
    background-color: ${transparentize(0.6, Theme.primary.colors.border)};
    padding: ${Theme.dimensions.x2};
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: ${Theme.dimensions.x2};
    margin: ${Theme.dimensions.x2};
    max-width: 900px;
`

export const BillBox = styled.div`
    padding: ${Theme.dimensions.x2};
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: ${Theme.dimensions.x1};
    font-size: 1rem;
    border-radius: ${Theme.secondary.radius};
background: ${Theme.primary.colors.surface};

& span{
    font-size: 0.8rem;
}
`;
export const BillCard = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    overflow: hidden;
    grid-gap: ${Theme.dimensions.x2};
`;

export const TriCost = styled.div`
    display: grid;
    grid-template-columns: auto max-content;
    background-color: ${transparentize(0.6, Theme.primary.colors.border)};
    border-radius: ${Theme.secondary.radius};
    margin-bottom: ${Theme.dimensions.x2};

    & span{
        opacity: 0.8;
        font-size: 0.8rem;
        display: block;
        margin-bottom: ${Theme.dimensions.x05};
    }
    & strong{
        margin: 0;
        font-weight: bolder;
    }
    & .large{
        padding: ${Theme.dimensions.x2};
        border-right: 1px solid ${Theme.primary.colors.border};
        & strong{
            font-size: 2.4rem;
        }
    }
    & .mini{
        display: grid;
        grid-template-rows: 1fr 1fr;
        & div:last-child{
            border-top: 1px solid ${Theme.primary.colors.border};
        }
        & div{
            padding: ${Theme.dimensions.x1} ${Theme.dimensions.x2};
        }
    }
`;

export const MemberGrid = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: max-content auto max-content ;
    grid-gap: ${Theme.dimensions.x2};
    margin: ${Theme.dimensions.x1} 0;
    border-bottom: 1px solid ${Theme.primary.colors.border};
    padding-bottom:  ${Theme.dimensions.x1};
`;

export const Symbol = styled.span`
    display: inline-block;
    font-size: 0.6rem;
    padding-right: 4px;
`;