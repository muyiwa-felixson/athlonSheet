import React, { useState, useEffect } from 'react';
import { FiTrash } from 'react-icons/fi';
import { UserContext } from '../../App';
import Cookies from "js-cookie";
import { Table, Select, Button } from 'antd';
import { Bubble } from '../../components/input.style';
import { Box } from '../../components/layout.style';

export const ManageMembers = () => {
  const UserData = React.useContext(UserContext);
  const [members, setMembers] = useState(UserData.invoice.get.members ? UserData.invoice.get.members : [] );

  const newRole = UserData.data.rateCard.get[0].role;
  const roles = UserData.data.rateCard.get?.map((elem, index) => {
    return { value: elem.role, label: `${elem.role} | ${elem.group}` }
  })
  const people = UserData.data.members.get?.map((elem, index) => {
    return { value: elem.email, label: `${elem.name}` }
  })

  const addMemberstoInvoice = () => {
    let newMember = { name: `Member`, role: newRole, active: true};
    setMembers([...members, newMember]);
  }
  const removeMembersfromInvoice = (index) => {
    let allMembers = [...members];
    allMembers.splice(index, 1);
    console.log(allMembers);
    setMembers(allMembers);
  }

  const setMembersRole = (index, val) => {
    let allMembers = [...members];
    allMembers[index].role = val;
    setMembers(allMembers);
  }

  const setMembersAssign = (index, val) => {
    let allMembers = [...members];
    allMembers[index].assign = val;
    setMembers(allMembers);
  }

  const columns = [
    {
      title: "",
      render: (v, row, i) => <Bubble {...{ name: row.role }} />,
      width: '50px'
    },
    {
      title: "Role",
      dataIndex: 'role',
      render: (v, row, i) => <Select
        defaultValue={row.role}
        value={row.role}
        style={{ width: 300 }}
        onChange={(e) => setMembersRole(i, e)}
        options={roles}
      />
    },
    {
      title: "Assign",
      dataIndex: 'assign',
      render: (v, row, i) => <Select
        defaultValue={"member"}
        value={row.assign}
        style={{ width: 200 }}
        onChange={(e) => setMembersAssign(i, e)}
        showSearch
        options={[{value: 'member', label:' AnyMember'},...people]}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
      />
    },
    {
      title: "...",
      render: (v, row, i) => <Button  onClick={()=> {removeMembersfromInvoice(i)}} icon={<FiTrash />} />,
      width: '50px'
    },
  ]

  useEffect(() => {
    const newInvoice = {...UserData.invoice.get, members: members};
    UserData.invoice.set(newInvoice);
    Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
}, [members]);
  return (
    <Box pad={['x2', 'x0']}>
      {/* <h4>Project Members</h4>
        <Box pad={['x1']} /> */}
      <Table columns={columns} dataSource={members} size="small" bordered style={{ maxWidth: '1000px' }} pagination={false} rowKey={(e,i) => `table_${e.role}_${i}`} />
      <Box pad={['x2', 'x0']} align="right" style={{ maxWidth: '1000px' }}>
        <Button onClick={addMemberstoInvoice}>Add New Member</Button>
      </Box>
    </Box>
  );
}