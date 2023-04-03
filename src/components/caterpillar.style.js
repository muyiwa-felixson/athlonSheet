import styled from "styled-components";
import Theme from "../utility/theme";


export const Caterpillar = styled.div`
    display: inline-grid;
    grid-template-columns: repeat(24, max-content);
    position: relative;

    & span.dot{
        border: 1px solid ${Theme.primary.colors.border};
        padding: ${Theme.dimensions.x1};
        min-width: 50px;
        display: flex;
        align-items: center;
        &:first-child{
            border-top-left-radius: ${Theme.primary.radius};
            border-bottom-left-radius: ${Theme.primary.radius};
        }
        &:last-child{
            border-top-right-radius: ${Theme.primary.radius};
            border-bottom-right-radius: ${Theme.primary.radius};
        }
    }
    & .slot{
        position: relative;
        width: 0;
        & span{
            position: absolute;
            bottom: -30px;
            left: 0;
            height: 24px;
            display: flex;
            align-items: center;
            padding: 0 ${Theme.dimensions.x05};
            border: 1px solid ${Theme.primary.colors.black};
            font-size: 0.6rem;
            color: #fff;
            background-color: ${Theme.primary.colors.black};
        }
        &:after{
            width: 1px;
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            height: calc(100% + 30px);
            background: ${Theme.primary.colors.black};
        }
    }
`;

export const TimeZone = styled.div`
& strong{
    display: block;
    line-height: 100%;;
}
    & span.date{
        font-size: 0.7rem;
        opacity: 0.6;
    }
`