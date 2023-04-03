import { Button, Input, Space } from "antd";
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from "react";
import { UserContext } from '../../App';
import { Box } from "../../components/layout.style";

export const UpdateRate = (props) => {
  const { index, element, closeModal, val } = props;
  const [value, setValue] = useState(val);
  const UserData = useContext(UserContext);

  const editRateCost = (i, e) => {
    let newRateCard = UserData.data.rateCard.get;
    newRateCard[i][e] = value;
    UserData.data.rateCard.set(newRateCard);
    Cookies.set("sheetRates", JSON.stringify(newRateCard), { expires: 3 });
  }

  const onSave = () => {
    editRateCost(index, element);
    closeModal();
  }

  const handleChange = e => setValue(e.target.value);

  useEffect(() => {
    setValue(val);
  }, [val]);

  return (
    <Box pad={['x0']}>
      <h2 style={{margin: '0 0 8px 0'}}>Edit Rate</h2>
      <span>{element.toUpperCase()} rates for {UserData.data.rateCard.get[index]?.role.toUpperCase()}</span>
      <Box pad={['x2', 'x0']}>
        <Input value={value} onChange={handleChange} />
      </Box>
      <Box align="right">
        <Space>
          <Button onClick={() => closeModal()}>Cancel</Button>
          <Button type="primary" onClick={() => onSave()}>Update Rate</Button>
        </Space>
      </Box>
    </Box>
  );
}
