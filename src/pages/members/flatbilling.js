import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Button, Empty, Input, Select } from 'antd';
import Cookies from "js-cookie";
import { Dotter, RowGroup, SprintGroup } from '../../components/sprintLoad.style';
import { range, sprintWorkDuration } from '../../utility/util';
import { Table } from '../../components/table.style';
import { Bubble, ViewEditInput } from '../../components/input.style';
import { FiTrash } from 'react-icons/fi';
import Theme from '../../utility/theme';
import { Box } from '../../components/layout.style';

export const ManageFlatBillingMembers = () => {
  const UserData = React.useContext(UserContext);
  const [groups, setGroups] = useState(UserData.invoice?.get.phases ? UserData.invoice.get.phases : []);

  const people = UserData.data?.members ? UserData.data?.members?.get?.map((elem, index) => {
    return { value: elem.email, label: `${elem.name}` }
  }) : [];

  const roles = UserData.data.rateCard.get?.map((elem, index) => {
    return { value: elem.role, label: `${elem.role} | ${elem.group}` }
  })
  const projectSprints = UserData.invoice?.get?.project?.sprints;

  const addGroup = () => {
      const newGroup = {
        duration: 5,
        name: groups.filter(e=> e.name === 'Phase Name') ? `Phase Name ${groups.length}` :'Phase Name',
        members: [],
      };
      setGroups([...groups, newGroup]);
  };

  const updateMember = (groupIndex, memberIndex, updatedMember) => {
    let newGroups = [...groups];
    newGroups[groupIndex].members[memberIndex] = updatedMember;
    setGroups(newGroups);
  };

  const deleteMember = (groupIndex, memberIndex) => {
    let newGroups = [...groups];
    newGroups[groupIndex].members.splice(memberIndex, 1);
    setGroups(newGroups);
  };
  const deleteGroup = (groupIndex) => {
    let newGroups = [...groups];
    newGroups.splice(groupIndex, 1);
    setGroups(newGroups);
  };

  const updateGroupName = (groupIndex, value) => {
    let newGroups = [...groups];
    newGroups[groupIndex].name = value.target.value;
    setGroups(newGroups);
  }

  const updateGroupDuration = (groupIndex, value) => {
    let newGroups = [...groups];
    newGroups[groupIndex].duration = value;
    setGroups(newGroups);
  }

  const addMember = (groupIndex, member) => {
    let newGroups = [...groups];
    newGroups[groupIndex].members.push(member);
    setGroups(newGroups);
  };


  useEffect(() => {
    if (groups.length === 0) {
      addGroup('new');
    }
    const newInvoice = { ...UserData.invoice.get, phases: groups };
    UserData.invoice.set(newInvoice);
    Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
  }, [groups]);

  const Group = ({ group, groupIndex, duration }) => {


    return (
      <RowGroup>
        <div className='groupHeader'>
          <Dotter number={groupIndex + 1} />
          <div>
            <ViewEditInput defaultValue={group.name} onBlur={e=> updateGroupName(groupIndex, e) } />
          </div>
          <div/>
          <div>
            <span style={{ display: 'inline-block', marginRight: Theme.dimensions.x2, fontWeight: 600 }}>Duration</span>
            <Select
              defaultValue={1}
              value={group.duration}
              style={{ width: 120 }}
              onChange={(event) =>
                updateGroupDuration(groupIndex, event)
              }
              options={range(1, 365).map(e => { return { label: `${e} Days`, value: e } })}
            />
          </div>
          <Box align="right">
          <Button type="primary" ghost style={{ borderRadius: Theme.primary.radius }} onClick={() => addMember(groupIndex, { role: roles[0].value, name: 'member', commitment: group.duration })}>
            Add Member
          </Button></Box>
          <Button className='memberDelete' onClick={() => { deleteGroup(groupIndex) }} icon={<FiTrash />} />
        </div>
        <Table minified empty={!(group.members.length > 0)}>
          {group.members.length > 0 ? <table>
            <thead>
              <tr>
                <th style={{ width: 240 }}>Role*</th>
                <th>Assignee</th>
                <th style={{ width: '180px' }}>Commitment per sprint*</th>
                <th style={{ width: '54px' }}>...</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((member, memberIndex) => (
                <tr key={memberIndex}>
                  {/* <td><Bubble {...{ name: member.role }} /></td> */}
                  <td>
                    <Select
                      defaultValue={member.role}
                      value={member.role}
                      style={{ display: 'block' }}
                      onChange={(event) =>
                        updateMember(groupIndex, memberIndex, {
                          ...member,
                          role: event,
                        })
                      }
                      options={roles}
                    />
                  </td>
                  <td>
                    <Select
                      defaultValue={'member'}
                      value={member.name}
                      style={{ display: 'block' }}
                      onChange={(event) =>
                        updateMember(groupIndex, memberIndex, {
                          ...member,
                          name: event,
                        })
                      }
                      options={[{ value: 'member', label: ' AnyMember' }, ...(people? people : [])]}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </td>
                  <td>
                    <Select
                      defaultValue={sprintWorkDuration}
                      value={member.commitment}
                      style={{ display: 'block' }}
                      onChange={(event) =>
                        updateMember(groupIndex, memberIndex, {
                          ...member,
                          commitment: event,
                        })
                      }
                      options={range(1, group.duration).map(e => { return { label: `${e} day${e > 1 ? 's' : ''}`, value: e } })}
                      status={member.commitment > group.duration ? 'error' :  false }
                    /></td>
                  <td><Button onClick={() => { deleteMember(groupIndex, memberIndex) }} icon={<FiTrash />} /></td>
                </tr>
              ))}
            </tbody>
          </table> : <Box pad={['x2']}><Empty description="No project phase members" image={Empty.PRESENTED_IMAGE_SIMPLE} /></Box>}
        </Table>
      </RowGroup>
    )
  };

  return (
    <Box pad={['x2', 'x0']}>
      <h4>Members & Project Phases</h4>
      {groups.length > 0 ? <>
        {groups.map((group, index) => {
          const previousTo = index > 0 ? groups[index - 1].to : 0;
          const sprintDays = (group.to - previousTo) * 10;
          return (
            <SprintGroup key={index}>
              <Group group={group} groupIndex={index} previousTo={previousTo} sprintDays={sprintDays} />
            </SprintGroup>
          )
        })}
        <Button type="primary" style={{ borderRadius: Theme.primary.radius }} size="large" onClick={addGroup}>Add New Project Phase </Button>
      </> : <>
        <Empty style={{ maxWidth: '800px' }} description="You currently have no project phase" ><Button type="primary" style={{ borderRadius: Theme.primary.radius }} size="large" onClick={addGroup}>Add New Project Phase</Button></Empty>
      </>}
    </Box>
  );
}