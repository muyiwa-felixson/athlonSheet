import { darken, transparentize } from "polished";
import styled, { css } from "styled-components";
import Theme from "../utility/theme";

export const Table = styled.div`
& table{
    /* display: block; */
    /* padding: ${Theme.dimensions.x15} ${Theme.dimensions.x2}; */
    border-radius: ${Theme.secondary.radius};
    /* border: 1px solid ${Theme.primary.colors.border}; */
    border-collapse: collapse;
    width: 100%;

    & thead{
        border-bottom: 1px solid ${Theme.primary.colors.border};
        border-top: 1px solid ${Theme.primary.colors.border};
        & th{
            padding: ${Theme.dimensions.x1};
            text-align: left;
            font-weight: 600;
        }
    }
    & tbody{
        & tr{
            border-bottom: 1px solid ${Theme.primary.colors.border};
            &:nth-child(even){
                background-color: ${transparentize(0.8, Theme.primary.colors.border)};
            }
             & td{
                padding: ${Theme.dimensions.x15};
                &:last-child{
                    background: ${transparentize(0.8, Theme.primary.colors.border)};
                }
             }
        }
    }
    & .ant-btn{
  align-items: center;
  justify-content: center;
  display: flex;
}
.alignR{
    text-align: right;
}
.alignL{
    text-align: left;
}
.invoiceRow{
    font-weight: 600;
    background-color: ${transparentize(0.8, Theme.primary.colors.green)} !important;
    color: ${darken(0.2, Theme.primary.colors.green)};
    border-left: 5px solid ${darken(0.2, Theme.primary.colors.green)};
    & strong{
        /* font-size: 1rem; */
    }
}
.totalBody{
    & tr:first-child{border-top: 2px solid ${darken(0.2, Theme.primary.colors.border)};}
    & tr{
       border-bottom: 1px dashed ${Theme.primary.colors.border};
       &:nth-child(even){
        background-color: ${transparentize(1, Theme.primary.colors.border)};
    }
    }
    & em{
        font-weight: 400;
        opacity: 0.8;
    }
}
.totalRow{
    font-weight: 900;
    /* background-color: ${transparentize(0.8, Theme.primary.colors.green)}; */
    /* color: ${darken(0.2, Theme.primary.colors.green)}; */
    border-top: 2px solid ${darken(0.2, Theme.primary.colors.border)};
    border-bottom: 2px solid ${darken(0.2, Theme.primary.colors.border)} !important;
    & td{
        padding: ${Theme.dimensions.x2} ${Theme.dimensions.x15};
    }
    & strong{
        font-size: 1.1rem;
        font-weight: 700;
    }
}
}
${props=> props.minified && css`
    /* padding-bottom: -2px; */
    & table{
        & thead{
            border-top: none;
            background: ${transparentize(0.5, Theme.primary.colors.border)};
            & th{
                padding: ${Theme.dimensions.x05} ${Theme.dimensions.x1};
                font-size: 0.8rem;
            }
        }
        & tbody{
            & tr{
                &:last-child{
                    border-bottom: none;
                }
            }
        }
    }
`}
`;

export const FreeTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-transform: capitalize;
    & tr {
        vertical-align: top;
    }
    & td{
        padding: ${Theme.dimensions.x2} 0;
        & span{
            opacity: 0.8;
            font-size: 0.8rem;
            display: block;
        }
    }
`;

export const SheetHeader = styled.div`
    & .ant-btn{
        display: flex;
        border-radius: 3px;
        align-items: center;
        & svg{
            margin-right: ${Theme.dimensions.x1};
        }
    }
`;

export const AthlonSheet = styled.div`
@media print {
    font-size: 10px;
    & .invoiceRow strong{
        font-weight: 600;
    }
}
`;