import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Input, Radio, DatePicker, InputNumber, Select, Switch, Space, Button } from 'antd';
import Cookies from "js-cookie";
import dayjs from 'dayjs';
import { Box, Grid, Label } from '../../components/layout.style';
import Theme from '../../utility/theme';
import { billCycleTypes, currencies, dateFormat, projectTypes, range } from '../../utility/util';
import { fetchCurrencyConversion } from '../login/googlesheet';

export const ManageProject = () => {
    const UserData = React.useContext(UserContext);
    const [busy, setBusy] = useState(false);
    const [project, setProject] = useState(UserData.invoice?.get.project ? UserData.invoice.get.project : {
        name: '',
        date: dayjs(dayjs(), dateFormat).format(dateFormat),
        type: 'sprint',
        sprints: 0,
        billrate: 2,
        billcycle: 'start',
        useCurrency: 'USDUSD',
        currencyData: {}
    });

    const changeValue = (e, vari) => {
        let newProject = { ...project };
        newProject[vari] = e.target.value;
        setProject(newProject);
    }

    const getRates = () => {
        let newProject = { ...project };
        setBusy(true);
        fetchCurrencyConversion().then((value) => {
            console.log(value);
            const data = {
                ...value, quotes: currenciesList.map(e => {
                    return { currency: e, value: value.quotes[e] };
                })
            }
            console.log(data);
            newProject.currencyData = data;
            newProject.convertCurrency = true;
            setProject(newProject);
            setBusy(false);
        }).catch((error) => {
            console.log(error);
            setBusy(false);
        });
    }

    useEffect(() => {
        // console.log(project);
        const newInvoice = { ...UserData.invoice.get, project: project };
        UserData.invoice.set(newInvoice);
        Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
    }, [project]);

    const currenciesList = currencies.map(e => {
        return e.value;
    })
    // console.log(project)
    return (
        <><Box pad={['x2', 'x0']}>
            <h4>Project Details</h4>
            <Box pad={['x1']} />
            <Grid cols="1fr" width="300px" gap={`${Theme.dimensions.x3} ${Theme.dimensions.x3}`} vAlign="center">
                <Box>
                    <Label>Project Name</Label>
                    <Input value={project.name} onChange={(e) => changeValue(e, 'name')} placeholder="ex. Project Phoenix" />
                </Box>
                <Box>
                    <Label>Project Start Date</Label>
                    <div><DatePicker value={dayjs(project.date, dateFormat)} onChange={(e, str) => changeValue({ target: { value: str } }, 'date')} format={dateFormat} /></div>
                </Box>
                <Box>
                    <Label>Project Type:</Label>
                    <Radio.Group value={project.type} onChange={e => changeValue(e, 'type')}>
                        {projectTypes.map((e, i) => <Box key={`project_type_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                    </Radio.Group>
                </Box>
                <Box>
                    <Label>Number of Sprints</Label>
                    <div><InputNumber min={1} max={100} defaultValue={project.sprints} onChange={e => changeValue({ target: { value: e } }, 'sprints')} /></div>
                </Box>

                <Box>
                    <Label>Billing Rate</Label>
                    <Select defaultValue={project.billrate} value={project.billrate} onChange={e => changeValue({ target: { value: e } }, 'billrate')} options={range(1, 20).map(e => { return { label: `Every ${e} Sprint${e > 1 ? 's' : ''}`, value: e } })} />
                </Box>
                <Box>
                    <Label>Billing Cycle Type</Label>
                    <Radio.Group value={project.billcycle} onChange={e => changeValue(e, 'billcycle')}>
                        {billCycleTypes.map((e, i) => <Box key={`bill_cycle_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                    </Radio.Group>
                </Box>
            </Grid>
            <Box pad={['x2', 'x0']}>
                <Label>Billing Currency</Label>
                <Space>
                    <Select style={{ width: '220px' }} defaultValue={project.useCurrency} value={project.useCurrency} onChange={e => changeValue({ target: { value: e } }, 'useCurrency')} 
                    options={currencies.map(e=> {
                        return {...e, disabled: !(project.currencyData?.success || e.value === 'USDUSD')}
                    })} 
                    />
                    <Button loading={busy}onClick={()=> getRates()}>Get rates</Button>
                </Space>
                {project.currencyData?.success && <em style={{ display: 'inline-block', paddingLeft: '16px', opacity: '0.6' }}>Last updated: {dayjs.unix(project.currencyData?.timestamp).format('H:mm Do MMMM')}</em>}
            </Box>
        </Box>
        </>
    );
}