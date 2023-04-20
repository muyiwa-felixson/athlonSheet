import { useContext } from "react"
import { UserContext } from "../../App";
import Cookies from 'js-cookie';
import styled from "styled-components";
import Theme from "../../utility/theme";
import { notification } from "antd";
import { FiUpload } from "react-icons/fi";

const UploadButton = styled.div`
/* text-align: right; */
& label{
    cursor: pointer;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    line-height: 1.5714285714285714;
    color: rgba(0, 0, 0, 0.88);
    display: inline-grid;
    grid-template-columns: max-content auto;
    grid-gap: ${Theme.dimensions.x1};
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
    const [api, contextHolder] = notification.useNotification();

    const handleFileInput = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        const getType = file.name.split(".");
        const type = getType[getType.length - 1];
        
        if(['athlon', 'gm'].includes(type)){
        reader.onload = (event) => {
          const content = event.target.result;
          const parsedData = JSON.parse(content);
    
          // Update the cookie with the parsed data
          if(parsedData.invoice){
          Cookies.set("invoice", JSON.stringify(parsedData.invoice, { expires: 3 }));
          Cookies.set("sheetRates", JSON.stringify(parsedData.rateCard, { expires: 3 }));
          UserData.invoice?.set(parsedData.invoice);
          UserData.data?.rateCard?.set(parsedData.rateCard);
          api.success({
            message: 'Yeh! Upload Successful',
            description: "Perfect, we are all set now, let's make the money",
        })
          window.location.reload(false);
        } else {
            api.error({
                message: 'There you go again!',
                description: "There's something wrong with the content of the file you are trying to upload",
            })
        } 
    };
} else {
        api.error({
            message: 'I see what you did there!',
            description: "But we do not allow this file type, sorry.",
        })
    }
    
        reader.readAsText(file);
      };

    return <UploadButton>
    {contextHolder}
    <label htmlFor="uploader" className=""><FiUpload /> Upload Invoice</label>
    <input type="file" id="uploader" onChange={handleFileInput} />
    </UploadButton>
}