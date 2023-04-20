import styled, { css } from "styled-components";
import Theme from "../utility/theme";
import { darken, transparentize } from "polished";


export const Box = styled.div`
    padding: ${props=> props.pad && props.pad.map(elem=> `${Theme.dimensions[elem]} `)};
    text-align: ${props=> props.align};
`;

export const Layout = styled.div`
min-width: 800px;
padding-bottom: 80px;
    & .ant-tabs-nav{
        padding: 0 ${Theme.dimensions.x5};
    }
    
    & .midpanel{
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 ${Theme.dimensions.x5};
    display: grid;
    transition: 0.3s all ease-in;
    grid-template-columns: 1fr;
    min-height: 100vh;
    }
    color: ${Theme.primary.colors.black};
    & .mainpanel{
        position: relative;
        z-index: 1;
        box-shadow: 5px 0 15px rgba(0,0,0,0.05);
    }
    ${props=> props.showTimeline && css`
    & .midpanel{
        grid-template-columns: auto 400px;
        @media screen and (max-width: 1440px){
            grid-template-columns: auto 0;
            ${Timeline}{
                display: none;
            }
        }
        ${Timeline}{
            border-left: 1px solid ${Theme.primary.colors.border};
        }
    }
    `}

    & .ant-form-item{
        margin-bottom: 0!important;
        &:where{
            margin-bottom: 0!important;
        }
    }
    & .ant-btn-lg{
        align-items: center;
        display: inline-grid;
        grid-template-columns: max-content auto;
        & svg{
            display: inline-block;
            margin-right: ${Theme.dimensions.x1};
        }
    }
`;

export const Timeline = styled.div`
    overflow: hidden;
    background: ${transparentize(0.9, Theme.primary.colors.border)};
    border-right: 1px solid ${Theme.primary.colors.border};
    &>div{
        width: 400px;
    }
`

export const Grid = styled.div`
    display: grid;
    padding: ${props=> props.pad && props.pad.map(elem=> `${Theme.dimensions[elem]} `)};
    gap: ${props=> props.gap};
    grid-template-columns: ${props=> props.cols};
    align-items: ${props=> props.vAlign};
    justify-content: ${props=> props.hAlign};
    max-width: ${props=> props.width};
    ${props=> props.responsive && css`
        @media screen (max-width: 800px){
            grid-template-columns: 1fr;
        }
    `}
`;

export const Warning = styled.div`
    padding: ${Theme.dimensions.x2};
    border-radius: ${Theme.primary.radius};
    border: 1px solid ${props=> transparentize(0.6,props.color ? props.color : Theme.primary.colors.google)};
    background: ${props=> transparentize(0.9,props.color ? props.color : Theme.primary.colors.google)};
    color: ${props=> darken(0.1, props.color ? props.color : Theme.primary.colors.google)};
    max-width: 1000px;
`

export const Label = styled.div`
    display: block;
    /* font-size: 1rem; */
    margin-bottom: ${Theme.dimensions.x05};
`;