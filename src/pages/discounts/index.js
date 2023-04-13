import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Input, Radio, InputNumber, Switch, Button, Space } from 'antd';
import Cookies from "js-cookie";
import { Box, Grid, Label } from '../../components/layout.style';
import Theme from '../../utility/theme';
import { discountTypes, travelTypes } from '../../utility/util';

export const ManageDiscounts = props => {
    const UserData = React.useContext(UserContext);
    const [extracost, setExtracost] = useState(UserData.invoice?.get.extracost ? UserData.invoice.get.extracost : {
        discount: false,
        discountValue: 5,
        travel: 'sprint',
        travelCost: 0,
        research: 'sprint',
        researchCost: 0,
        insurance: false,
    });

    const changeValue = (e, vari) => {
        let newExtracost = { ...extracost };
        newExtracost[vari] = e.target.value;
        setExtracost(newExtracost);
    }


    useEffect(() => {
        const newInvoice = { ...UserData.invoice.get, extracost: extracost };
        UserData.invoice.set(newInvoice);
        Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
    }, [extracost]);


    return (
        <Box pad={['x0', 'x0']}>
            <Box pad={['x2', 'x0']}>
                <h4>Travel & Research</h4>
                <Box pad={['x1']} />
                <Grid cols="1fr" width="300px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                    <Box>
                        <Label>Travel Amount: </Label>
                        <Space>
                            <Input style={{ width: "150px" }} value={extracost.travelCost} defaultValue={extracost.travelCost} onChange={(e) => changeValue(e, 'travelCost')} />
                            <Button onClick={() => changeValue({ target: { value: 0 } }, 'travelCost')}>Clear</Button></Space>
                    </Box>
                    <Box>
                        <Label>Travel Billing Type:</Label>
                        <Radio.Group value={extracost.travel} onChange={e => changeValue(e, 'travel')}>
                            {travelTypes.map((e, i) => <Box key={`travel_type_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                        </Radio.Group>
                    </Box>
                </Grid>
                <Box pad={['x1']} />
                <Grid cols="1fr" width="300px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                    <Box>
                        <Label>Research Amount: </Label>
                        <Space>
                            <Input style={{ width: "150px" }} value={extracost.researchCost} defaultValue={extracost.researchCost} onChange={(e) => changeValue(e, 'researchCost')} />
                            <Button onClick={() => changeValue({ target: { value: 0 } }, 'researchCost')}>Clear</Button></Space>
                    </Box>
                    <Box>
                        <Label>Research Billing Type:</Label>
                        <Radio.Group value={extracost.research} onChange={e => changeValue(e, 'research')}>
                            {travelTypes.map((e, i) => <Box key={`research_type_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                        </Radio.Group>
                    </Box>
                </Grid>
            </Box>
            <Box pad={['x2', 'x0']}>
                <h4>Discounts & Insurance</h4>
                <Box pad={['x1']} />
                <Grid cols="1fr" width="300px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                    <Box><Label>Discount %</Label>
                        <div><InputNumber min={1} max={100} defaultValue={extracost.discountValue} onChange={(e) => changeValue({ target: { value: e } }, 'discountValue')} /></div>
                    </Box>
                    <Box>
                        <Label>Applied Discount:</Label>
                        <Radio.Group value={extracost.discount} onChange={e => changeValue(e, 'discount')}>
                            {discountTypes.map((e, i) => <Box key={`discount_type_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                        </Radio.Group>
                    </Box>
                </Grid>
            </Box>

            <Box pad={['x2', 'x0']}>
                <h4>Payment Insurance</h4>
                <Box pad={['x1']} />
                <Grid cols="max-content auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                    <span>Apply 5% payment insurance to project</span>
                    <div><Switch defaultChecked={extracost.insurance} onChange={e => changeValue({ target: { value: e } }, 'insurance')} /></div>
                </Grid>
            </Box>
        </Box>
    );
}