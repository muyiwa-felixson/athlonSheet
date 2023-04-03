import styled, { css } from "styled-components";
import Theme from "../utility/theme";
import Autosuggest from 'react-autosuggest';
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { generateColorFromLetters } from "../utility/util";
import { transparentize } from "polished";

const SeachInputWrapper = styled.div`
    position: relative;
    display: inline-block;

    & input {
        position: relative;
        height: ${Theme.dimensions.x6};
        padding: ${Theme.dimensions.x15} ${Theme.dimensions.x2};
        border-radius: ${Theme.primary.radius};
        border: 1px solid ${Theme.primary.colors.border};
        z-index: 1;
        background: none;
        min-width: 400px;
    }
    & .input-icon{
        position: absolute;
        z-index: 0;
        top: 0;
        right: 0;
        width: ${Theme.dimensions.x6};
        height: ${Theme.dimensions.x6};
        display: flex;
        align-items: center;
        justify-content: center;
        padding:  ${Theme.dimensions.x2};
    }
    & .react-autosuggest__suggestions-container{
        position: absolute;
        top: ${Theme.dimensions.x6};
        left: 0;
        z-index: 2;
        width: 100%;
        &.react-autosuggest__suggestions-container--open{
            & ul{
                border-radius: ${Theme.primary.radius};
                border: 1px solid ${Theme.primary.colors.border};
                background: ${Theme.primary.colors.surface};
                margin: 0;
                padding:  ${Theme.dimensions.x15};
                list-style: none;
                & li{
                    /* padding:  ${Theme.dimensions.x15}; */

                }
            }
        }
    }
`;

const MemberWrapper = styled.div`
    display: grid;
    grid-template-columns: max-content auto max-content;
    border-radius: ${Theme.primary.radius};
    padding:  ${Theme.dimensions.x2};
    align-items: center;
    grid-gap:  ${Theme.dimensions.x2};
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease-in;

    & strong{
        display: block;
    }
    &:hover{
        background: ${transparentize(0.6, Theme.primary.colors.border)};
        & .but{
            opacity: 1;
        }
    }
    & .but{
        border-radius: ${Theme.primary.radius};
        border: 1px solid ${Theme.primary.colors.border};
        padding: ${Theme.dimensions.x1};
        display: flex;
        flex-direction: row;
        align-items: center;
        opacity: 0;

        & svg{
            margin-right:  ${Theme.dimensions.x1};
        }
    }
`;

const BubbleWrap = styled.div`
        width: ${Theme.dimensions.x4};
        height: ${Theme.dimensions.x4};
        background: ${props => props.color};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        border-radius: 50%;
`;

export const Bubble = props => {
    return <BubbleWrap color={generateColorFromLetters(getFirstTwoLetters(props.name))}>{getFirstTwoLetters(props.name)}</BubbleWrap>
}


export function getFirstTwoLetters(name) {
    const words = name.replace(/[^a-zA-Z0-9]/g, '').split(' ');
    let result = '';
    if (words.length > 0) { result += words[0][0]; }
    if (words.length > 1) { result += words[1][0]; }
    return result.toUpperCase();
}


export const MemberBubble = props => {
    return <MemberWrapper>
        <Bubble {...props} />
        <div>
            <strong>{props.name}</strong>
            <span>{props.email}</span>
        </div>
        <div><span className="but"><FiPlusSquare /> Add to project</span></div>
    </MemberWrapper>
}


export const InputAutoComplete = props => {
    return <SeachInputWrapper>
        <Autosuggest {...props} />
        <FiSearch className="input-icon" />
    </SeachInputWrapper>
}

export const TableInput = styled.span`
    display: flex;
    padding: ${Theme.dimensions.x05};
    width: auto;
    border: 1px solid transparent;
    transition: 0.2s all ease-in;
    border-radius: ${Theme.primary.radius};

    &:hover{
        background: ${transparentize(0.9, Theme.primary.colors.google)};
    }
    ${props => props.active && css`
        background: ${transparentize(0.6, Theme.primary.colors.google)};
        color: ${Theme.primary.colors.google};
        font-weight: 600;
    `}
`;