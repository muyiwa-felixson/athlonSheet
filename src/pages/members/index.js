import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Button, Empty, Select } from 'antd';
import Cookies from "js-cookie";
import { Dotter, RowGroup, SprintGroup } from '../../components/sprintLoad.style';
import { range, sprintWorkDuration } from '../../utility/util';
import { Table } from '../../components/table.style';
import { Bubble } from '../../components/input.style';
import { FiTrash } from 'react-icons/fi';
import Theme from '../../utility/theme';
import { Box } from '../../components/layout.style';

export const ManageMembers = () => {
  const UserData = React.useContext(UserContext);
  const [groups, setGroups] = useState(UserData.invoice?.get.loading ? UserData.invoice.get.loading : []);

  const people = UserData.data?.members ? UserData.data?.members?.get?.map((elem, index) => {
    return { value: elem.email, label: `${elem.name}` }
  }) : [];

  const roles = UserData.data.rateCard.get?.map((elem, index) => {
    return { value: elem.role, label: `${elem.role} | ${elem.group}` }
  })
  const projectSprints = UserData.invoice?.get?.project?.sprints;

  const addGroup = (stat) => {
    const newGroupIndex = groups.length + 1;
    const previousto = groups.length > 0 ? groups[groups.length - 1].to : 0;
    if (stat === 'new' || previousto < projectSprints) {
      const newGroup = {
        // name: `group ${newGroupIndex}`,
        to: stat === 'new' ? projectSprints : previousto + 1,
        members: [],
      };
      setGroups([...groups, newGroup]);
    } else {
      alert("We shouldn't have more groups outside the sprint range");
    }
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

  const updateGroupto = (groupIndex, toValue) => {
    let newGroups = [...groups];
    newGroups[groupIndex].to = toValue;
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
    const newInvoice = { ...UserData.invoice.get, loading: groups };
    UserData.invoice.set(newInvoice);
    Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
  }, [groups]);

  const Group = ({ group, groupIndex, previousTo, sprintDays }) => {


    return (
      <RowGroup disabled={!(projectSprints > previousTo)}>
        <div className='groupHeader'>
          <Dotter number={groupIndex + 1} />
          <div>
            <strong>Sprint Loading {groupIndex + 1}</strong>
          </div>
          <div>
            <em className='sub'>({sprintDays} days)</em>
          </div>
          <div>
            <span style={{ display: 'inline-block', marginRight: Theme.dimensions.x2, fontWeight: 600 }}>Sprint {previousTo + 1 === group.to ? group.to : `${previousTo + 1}`} to</span>
            <Select
              defaultValue={1}
              value={group.to}
              style={{ width: 120 }}
              notFoundContent="invalid sprint entry"
              onChange={(event) =>
                updateGroupto(groupIndex, event)
              }
              options={range((previousTo + 1), projectSprints).map(e => { return { label: `Sprint ${e}`, value: e } })}
            />
          </div>
          <Box align="right">
          <Button type="primary" ghost style={{ borderRadius: Theme.primary.radius }} onClick={() => addMember(groupIndex, { role: roles[0].value, name: 'member', commitment: sprintWorkDuration })}>
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
                      options={range(1, sprintWorkDuration).map(e => { return { label: `${e} day${e > 1 ? 's' : ''}`, value: e } })}
                    /></td>
                  <td><Button onClick={() => { deleteMember(groupIndex, memberIndex) }} icon={<FiTrash />} /></td>
                </tr>
              ))}
            </tbody>
          </table> : <Box pad={['x2']}><Empty description="No sprint load members" image={Empty.PRESENTED_IMAGE_SIMPLE} /></Box>}
        </Table>
      </RowGroup>
    )
  };

  return (
    <Box pad={['x2', 'x0']}>
      <h4>Members & Sprint Loading</h4>
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
        <Button type="primary" disabled={groups[groups.length - 1]?.to >= projectSprints} style={{ borderRadius: Theme.primary.radius }} size="large" onClick={addGroup}>Add New Loading</Button>
      </> : <>
        <Empty style={{ maxWidth: '800px' }} description="You currently have no sprint load" ><Button type="primary" disabled={groups[groups.length - 1]?.to >= projectSprints} style={{ borderRadius: Theme.primary.radius }} size="large" onClick={addGroup}>Add New Group</Button></Empty>
      </>}
    </Box>
  );
}