import { Button, Space, Switch, Form } from "antd";
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from "react";
import { UserContext } from '../../App';
import { Bubble } from "../../components/input.style";
import { MemberGrid, TriCost } from "../../components/invoiceCards.style";
import { Box } from "../../components/layout.style";

export const UpdateMembers = (props) => {
  const UserData = useContext(UserContext);
  // console.log(excludedMembers);

  const { element, closeModal } = props;
  const [sprint, setSprint] = useState({ ...element });
  const [members, setMembers] = useState(UserData.excluded.get[`sprint_${sprint.sprint}`] ? UserData.excluded.get[`sprint_${sprint.sprint}`] : null);
  const [form] = Form.useForm();

  // console.log("new members",members);
  const handleChange = (e) => {
    const ind = Object.keys(e)[0];
    // console.log(e, ind);
    let newMembers = { ...members };
    if(newMembers[ind]){
      newMembers[ind].active = e[ind];
    } else {
      newMembers[ind] ={...sprint.members[ind], active: e[ind]};
    }
    setMembers(newMembers);
    // console.log("new members",members);
  };


  useEffect(() => {
    setSprint({ ...element });
  }, [element]);

  useEffect(() => {
    if(members){
    let newExcluded = {...UserData.excluded.get};
    newExcluded[`sprint_${sprint.sprint}`] = members;
    UserData.excluded.set(newExcluded);
    Cookies.set("excluded", JSON.stringify(newExcluded), { expires: 3 });
    }
  }, [members]);

  return (
    <Box pad={['x0']}>
      <h4 style={{ margin: '0 0 8px 0' }}>Sprint {sprint.sprint}</h4>
      {/* <span>{element.toUpperCase()} rates for {UserData.data.rateCard.get[index]?.role.toUpperCase()}</span> */}
      <Box pad={['x2', 'x0']}>
        <TriCost>
          <div className="large">
            <span>Personnel Cost</span>
            <strong>{sprint.cost}</strong>
          </div>
          {sprint.travel && sprint.research && <div className="mini">
            <div>
              <span>Travels</span>
              <strong>${sprint.travel}</strong>
            </div>
            <div>
              <span>Research</span>
              <strong>${sprint.research}</strong>
            </div>
          </div>}
        </TriCost>
        <strong>Members</strong>
        <Form
          onValuesChange={(e) => handleChange(e)}
          form={form}
          >
          {
            sprint.members.map((elem, i) => {
              // console.log("Member Status in sprint: ",UserData.excluded.get[`sprint_${sprint.sprint}`] ? UserData.excluded.get[`sprint_${sprint.sprint}`] : null, UserData.excluded.get);
              return <MemberGrid key={`memberGrid_${i}`}>
                <Bubble name={elem.role} />
                <strong>{elem.role}</strong>
                <Form.Item
                  name={i}
                  noStyle
                  valuePropName="checked"
                >
                  <Switch size="small" defaultChecked={UserData.excluded.get[`sprint_${sprint.sprint}`] && UserData.excluded.get[`sprint_${sprint.sprint}`][i]  ? UserData.excluded.get[`sprint_${sprint.sprint}`][i].active : true} /></Form.Item>
              </MemberGrid>
            })
          }</Form>
      </Box>
      <Box align="right">
        <Space>
          <Button type="primary" onClick={() => closeModal()}>Save & Exit</Button>
          {/* <Button
            type="primary"
            onClick={() => onSave()}
          >Update Sprint Members</Button> */}
        </Space>
      </Box>
    </Box>
  );
}
