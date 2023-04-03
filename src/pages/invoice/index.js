import React, { useContext } from 'react';
import { Tabs } from 'antd';
import { UserContext } from '../../App';
import MembersTab from './members.tab';
import { FiPackage, FiCreditCard, FiUsers, FiPercent, FiList } from 'react-icons/fi';
import { TabItem } from '../../components/tab.style';
import RateTab from './ratecard.tab';
import Customer from './customer';
import ProjectTab from './project.tab';
import DiscountTab from './discount.tab';
import SprintTable from '../sprint/sprintTable';


const Invoice = () => {
  const UserData = useContext(UserContext);
    const items = [
        {
          key: '1',
          label: <TabItem><FiPackage /> Project Details</TabItem>,
          children: <ProjectTab />,
        },
        {
          key: '2',
          disabled: !(typeof UserData.invoice.get.customer === 'object'),
          label: <TabItem><FiUsers /> Members</TabItem>,
          children: <MembersTab />,
        },
        {
          key: '3',
          disabled: !(typeof UserData.invoice.get.customer === 'object'),
          label: <TabItem><FiPercent /> Discount &amp; Extra Costs</TabItem>,
          children: <DiscountTab />,
        },
        {
          key: '4',
          label: <TabItem><FiCreditCard /> Rate Card</TabItem>,
          children: <RateTab />,
        },
        {
          key: '5',
          disabled: !(typeof UserData.invoice.get.extracost === 'object'),
          label: <TabItem><FiList /> Modify Sprints</TabItem>,
          children: <SprintTable />
        },
      ];
      // console.log("Excluded", UserData.invoice.get.excluded);

    return<>
    <Customer />
    <Tabs animated defaultActiveKey="1" items={items}  />
    </>
}

export default Invoice;