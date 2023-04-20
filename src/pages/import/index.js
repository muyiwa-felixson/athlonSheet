import { useContext, useRef } from "react"
import { UserContext } from "../../App";
import Cookies from 'js-cookie';
import styled from "styled-components";
import Theme from "../../utility/theme";

const UploadButton = styled.div`
text-align: right;
& label{
    cursor: pointer;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    line-height: 1.5714285714285714;
    color: rgba(0, 0, 0, 0.88);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${Theme.dimensions.x05};
    padding: 0 ${Theme.dimensions.x2};
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    height: 40px;
    font-size: 16px;
    border: 1px solid ${Theme.primary.colors.border};
    &:hover{
        border: 1px solid ${Theme.primary.colors.google};
        color: ${Theme.primary.colors.google};
    }
}
& input{
    display: none;
}
`;

export const Importer = () => {
    const UserData = useContext(UserContext);

    const handleFileInput = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (event) => {
          const content = decodeURIComponent(event.target.result);
          const parsedData = JSON.parse(content);
    
          // Update the cookie with the parsed data
          Cookies.set("invoice", content, { expires: 3 });
          UserData.invoice?.set(parsedData);
          window.location.reload(false);
        };
    
        reader.readAsText(file);
      };

    return <UploadButton>
    <label for="uploader" className="">Upload Invoice</label>
    <input type="file" id="uploader" onChange={handleFileInput} />
    </UploadButton>
}