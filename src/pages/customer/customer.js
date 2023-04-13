import { Box, Grid, Label } from "../../components/layout.style";
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
        let newCustomer = { ...customer };
        newCustomer[vari] = e.target.value;
        setCustomer(newCustomer);
    }

    useEffect(() => {
        const newInvoice = { ...UserData.invoice.get, customer: customer };
        UserData.invoice.set(newInvoice);
        Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
    }, [customer]);

    return <Box pad={['x5', 'x5','x2','x0']}>
        <h4>Customer Details</h4>
        <Box pad={['x1']} />
        <Grid cols="1fr" width="300px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
            <Box><Label>Customer</Label>
                <Input value={customer.name} onChange={(e) => changeValue(e, 'name')} placeholder="ex. Amazon" /></Box>

            <Box><Label>Contact's Name</Label>
                <Input value={customer.contactName} onChange={(e) => changeValue(e, 'contactName')} placeholder="ex. Lexie Spiro" />
            </Box>
            <Box><Label>Contact's Email</Label>
                <Input value={customer.contactEmail} onChange={(e) => changeValue(e, 'contactEmail')} placeholder="ex. lexie@amazon.com" /></Box>

            <Box>
                <Label>Customer Type</Label>
                <Radio.Group value={customer.type} onChange={e => changeValue(e, 'type')}>
                    {businessTypes.map((e, i) => <Box pad={['x1', 'x0']} key={`business_type_${i}`}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                </Radio.Group>
            </Box>
        </Grid>

    </Box>
}

export default Customer; 