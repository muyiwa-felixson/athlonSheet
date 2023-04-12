import React from 'react';
import Customer from '../customer/customer';
import { ManageDiscounts } from '../discounts';
import { Box } from '../../components/layout.style';
import { ManageMembers } from '../members';
import { ManageProject } from '../projects';


const Invoice = () => {

    return<div>
    <Customer />
    <ManageProject />
    <ManageMembers />
    <ManageDiscounts />
    <Box pad={['x3']} />
    </div>
}

export default Invoice;