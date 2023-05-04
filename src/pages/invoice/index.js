import React from 'react';
import { UserContext } from '../../App';
import Customer from '../customer/customer';
import { ManageDiscounts } from '../discounts';
import { Box } from '../../components/layout.style';
import { ManageMembers } from '../members';
import { ManageProject } from '../projects';
import { ManageFlatBillingMembers } from '../members/flatbilling';


const Invoice = () => {
    const UserData = React.useContext(UserContext);
    return <div>
            <Customer />
            <ManageProject />
            {UserData?.invoice?.get.project && UserData.invoice.get.project.type === 'sprint' && <ManageMembers />}
            {UserData?.invoice?.get.project && UserData.invoice.get.project.type === 'fixed' && <ManageFlatBillingMembers />}
            <ManageDiscounts />
            <Box pad={['x3']} />
            </div>
}

export default Invoice;