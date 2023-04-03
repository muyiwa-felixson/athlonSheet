import { Box, Grid } from "../../components/layout.style";
import { UserContext } from '../../App';
import { Radio, Input } from 'antd';
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Theme from "../../utility/theme";
import { businessTypes } from "../../utility/util";

  
const Customer = () => {
    const UserData = React.useContext(UserContext);
    const [customer, setCustomer] = useState(UserData.invoice.get?.customer ? UserData.invoice.get?.customer : {
        name: '',
        contactName: '',
        contactEmail: '',
        type: 'enterprise'
    });

    const changeValue = (e, vari) => {
        let newCustomer = {...customer};
        newCustomer[vari] = e.target.value;
        setCustomer(newCustomer);
    }

    useEffect(() => {
        const newInvoice = {...UserData.invoice.get, customer: customer};
        UserData.invoice.set(newInvoice);
        Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
    }, [customer]);

    return <Box pad={['x5', 'x5']}>
        <h4>Customer Details</h4>
       <Box pad={['x1']}/>
        <Grid cols="max-content auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
            <span>Customer name</span>
            <Input value={customer.name} onChange={(e)=> changeValue(e, 'name')} />
            
            <span>Customer Contact</span>
                <Input addonBefore="Name"  value={customer.contactName} onChange={(e)=> changeValue(e, 'contactName')} />
            <span></span>
                <Input addonBefore="Email" value={customer.contactEmail} onChange={(e)=> changeValue(e, 'contactEmail')}  />
            <span>Customer Type</span>
            <Radio.Group value={customer.type} onChange={e=> changeValue(e, 'type')} optionType="button"
        buttonStyle="solid" options={businessTypes} />
        </Grid>
   
    </Box>
} 

export default Customer; 