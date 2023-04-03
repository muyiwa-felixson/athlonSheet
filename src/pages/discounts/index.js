import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Input, Radio, InputNumber, Switch } from 'antd';
import Cookies from "js-cookie";
import { Box, Grid } from '../../components/layout.style';
import Theme from '../../utility/theme';
import {travelTypes } from '../../utility/util';

export const ManageDiscounts = props => {
    const UserData = React.useContext(UserContext);
    const [extracost, setExtracost] = useState(UserData.invoice?.get.extracost ? UserData.invoice.get.extracost : {
        discount: false,
        discountAt: 1,
        discountValue: 0,
        travel: 'none',
        travelCost: 0,
        travelDiscount: false,
        research: 'none',
        researchCost: 0,
        researchDiscount: false,
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
        <>
        {/* <Grid cols="max-content auto max-content" responsive>x */}
        <Box pad={['x2', 'x0']}>
            <h4>Discounts</h4>
            <Box pad={['x1']} />
            <Grid cols="120px auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                <span>Apply Discount</span>
                <div><Switch defaultChecked={extracost.extracost} onChange={e=> changeValue({ target: { value: e } }, 'discount')} /></div>
                {
                extracost.discount && <>
                <span>Discount Value</span>
                <div><InputNumber min={1} max={100} addonAfter="%" style={{width: "150px"}} defaultValue={extracost.discountValue} onChange={(e)=> changeValue({ target: { value: e } }, 'discountValue')} /></div>

                <span>Discount Starts at</span>
                <div><InputNumber min={1} max={UserData.invoice?.get.project.sprints} style={{width: "150px"}} addonAfter="Sprints"  defaultValue={extracost.discountAt} onChange={(e)=> changeValue({ target: { value: e } }, 'discountAt')} /></div>
                </>
                }
            </Grid>
        </Box>
        <Box pad={['x2', 'x0']}>
            <h4>Travel</h4>
            <Box pad={['x1']} />
            <Grid cols="120px auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                <span>Billing Type</span>
                <div><Radio.Group value={extracost.travel} onChange={e => changeValue(e, 'travel')} optionType="button"
                    buttonStyle="solid" options={travelTypes} /></div>
                {
                extracost.travel !== 'none' && <>
                    <span>Travel Cost</span>
                    <div><Input style={{width: "150px"}} disabled={extracost.travel === 'none'} addonAfter={extracost.travel === 'sprint' ? 'per sprint' : false} defaultValue={extracost.travelCost} onChange={(e)=> changeValue(e, 'travelCost')} /></div>
                    {extracost.travel === 'sprint' && <><span>Discount Applies</span>
                <div><Switch defaultChecked={extracost.travelDiscount} onChange={e=> changeValue({ target: { value: e } }, 'travelDiscount')} /></div></>}
                </>
                }
             </Grid>
        </Box>
        <Box pad={['x2', 'x0']}>
            <h4>Research Incentives</h4>
            <Box pad={['x1']} />
            <Grid cols="120px auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                <span>Billing Type</span>
                <div><Radio.Group value={extracost.research} onChange={e => changeValue(e, 'research')} optionType="button"
                    buttonStyle="solid" options={travelTypes} /></div>
                {
                    extracost.research !== 'none' && <>
                        <span>Research Cost</span>
                        <div><Input style={{width: "150px"}} disabled={extracost.research === 'none'} addonAfter={extracost.research === 'sprint' ? 'per sprint' : false} defaultValue={extracost.researchCost} onChange={(e)=> changeValue(e, 'researchCost')} /></div>
                        {extracost.research === 'sprint' && <><span>Discount Applies</span>
                <div><Switch defaultChecked={extracost.researchDiscount} onChange={e=> changeValue({ target: { value: e } }, 'researchDiscount')} /></div></>}
                    </>
                }
             </Grid>
        </Box>
        <Box pad={['x2', 'x0']}>
            <h4>Payment Insurance</h4>
            <Box pad={['x1']} />
            <Grid cols="160px auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                <span>5% Payment Insurance</span>
                <div><Switch defaultChecked={extracost.insurance} onChange={e=> changeValue({ target: { value: e } }, 'insurance')} /></div>
            </Grid>
        </Box>
        {/* </Grid> */}
        </>
    );
}