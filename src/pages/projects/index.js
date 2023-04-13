import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Input, Radio, DatePicker, InputNumber, Select } from 'antd';
import Cookies from "js-cookie";
import dayjs from 'dayjs';
import { Box, Grid, Label } from '../../components/layout.style';
import Theme from '../../utility/theme';
import { billCycleTypes, dateFormat, projectTypes, range } from '../../utility/util';

export const ManageProject = () => {
    const UserData = React.useContext(UserContext);
    const [project, setProject] = useState(UserData.invoice?.get.project ? UserData.invoice.get.project : {
        name: '',
        date: dayjs(dayjs(), dateFormat).format(dateFormat),
        type: 'sprint',
        sprints: 0,
        billrate: 2,
        billcycle: 'start'
    });

    const changeValue = (e, vari) => {
        let newProject = { ...project };
        newProject[vari] = e.target.value;
        setProject(newProject);
    }

    useEffect(() => {
        const newInvoice = { ...UserData.invoice.get, project: project };
        UserData.invoice.set(newInvoice);
        Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
    }, [project]);

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
        </Box>
        </>
    );
}