import React from 'react';
import { FiTrash } from 'react-icons/fi';
import { UserContext } from '../../App';
import { Box } from '../../components/layout.style';
import { Table } from '../../components/table.style';
import { Select, Button } from 'antd';
import { Bubble } from '../../components/input.style';

export const MembersList = () => {
    const UserData = React.useContext(UserContext);

    const removeMembersfromInvoice = (index) => {
        let allMembers = UserData.invoice.get.members;
        allMembers.splice(index, 1);
        UserData.invoice.set({
            ...UserData.invoice.get,
            members: allMembers
        })
    }

    const setMembersRole = (index, val) => {
        let allMembers = UserData.invoice.get.members;
        allMembers[index].role = val;
        UserData.invoice.set({
            ...UserData.invoice.get,
            members: allMembers
        })
    }

    const getRole = (role) => {
        return UserData.data.rateCard.get.find(e=> e.role === role);
    }
    console.log('rate card: ', UserData.data.rateCard.get, 'memebers: ', UserData.invoice.get);
  return (
    <Box pad={['x1', 'x0']}>
    <Table>
        <thead>
            <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Name</th>
            </tr>
        </thead>
    <tbody>
      {
          UserData.invoice?.get.members.map((elem, index) => {
              return <tr key={elem.email}>
                <td><Bubble {...elem} /></td>
                <td><strong>{elem.name}</strong></td>
                <td>{elem.email}</td>
                <td>
                <Select
                    value={elem.role}
                    style={{ width: 190 }}
                    onChange={(e)=> setMembersRole(index, e)}
                    options={UserData.data.rateCard.get?.map((elem,index)=>{
                        return {value: elem.role, label: `${elem.role} | ${elem.group}`}
                    })}
                />
                </td>
                <td><Button icon={<FiTrash onClick={()=> {removeMembersfromInvoice(index)}} />} /></td>
                </tr>
            })
        }
    </tbody>
    </Table>
    </Box>
  );
}