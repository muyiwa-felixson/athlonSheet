import React, { useState, useEffect } from 'react';
import { FiTrash } from 'react-icons/fi';
import { UserContext } from '../../App';
import { Table, Select, Button, Input, InputNumber } from 'antd';
import { Bubble } from '../../components/input.style';
import { Box } from '../../components/layout.style';
import { SprintGroup } from '../../components/sprintLoad.style';
import { projectTypes } from '../../utility/util';

export const LoadRow = props => {
  const UserData = React.useContext(UserContext);
  const project = UserData.invoice?.get.project;
  const previousTo = props.previous ? props.previous.to : 1;
  const [groupLoad, setGroupLoad] = useState({...props.current, from: previousTo, to: project.sprints});


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
      />
    },
    {
      title: "Assign",
      dataIndex: 'assign',
      render: (v, row, i) => <Select
       
      />
    },
    {
      title: "Commitment",
      render: (v, row, i) => <InputNumber min={0} max={100} defaultValue={100}    />,
    },
    {
      title: "...",
      render: (v, row, i) => <Button  icon={<FiTrash />} />,
      width: '50px'
    },
  ]

    return  <SprintGroup>
              <div className='groupHeader'>
                <div>
                  <strong>Sprint Load {groupLoad.group}</strong>
                  <span className='sub'>{groupLoad.to - groupLoad.from} Sprints = {(groupLoad.to - groupLoad.from) * 10} days</span>
                </div>
                <div />
                <div>
                  Sprint range from 
                  <Select disabled style={{ width: 100 }} defaultValue={previousTo} options={Array.from(Array(project.sprints).keys()).map((e,i)=> { return {label: `Sprint ${i+1}`, value: i+1 }})} /> 
                  to  
                  <Select style={{ width: 100 }} defaultValue={project.sprints} options={Array.from(Array(project.sprints).keys()).map((e,i)=> { return {label: `Sprint ${i+1}`, value: i+1 }})} />
                </div>
              </div>
            <Table columns={columns} dataSource={groupLoad.members} size="small" bordered style={{ maxWidth: '1000px' }} pagination={false} rowKey={(e,i) => `table_${e.role}_${i}`} />
    </SprintGroup>;
}