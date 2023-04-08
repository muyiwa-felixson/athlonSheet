import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Input, Radio, DatePicker, InputNumber, Switch } from 'antd';
import Cookies from "js-cookie";
import dayjs from 'dayjs';
import { Box, Grid } from '../../components/layout.style';
import Theme from '../../utility/theme';
import { billCycleTypes, dateFormat, projectTypes } from '../../utility/util';

export const ManageProject = () => {
    const UserData = React.useContext(UserContext);
    const [project, setProject] = useState(UserData.invoice?.get.project ? UserData.invoice.get.project : {
        name: '',
        date: dayjs(dayjs(), dateFormat),
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
        // console.log(newInvoice);
    }, [project]);

    return (
        <><Box pad={['x2', 'x0']}>
            {/* <h4>Project Details</h4>
        <Box pad={['x1']} /> */}
            <Grid cols="max-content auto" width="500px" gap={`${Theme.dimensions.x2} ${Theme.dimensions.x3}`} vAlign="center">
                <span>Name of project</span>
                <Input value={project.name} onChange={(e) => changeValue(e, 'name')} />

                <span>Project Start Date</span>
                <div><DatePicker value={project.date !== null ? dayjs(project.date, dateFormat) : dayjs(dayjs(), dateFormat)} onChange={(e, str) => changeValue({ target: { value: str } }, 'date')} format={dateFormat} /></div>

                <span>Project Type</span>
                <Radio.Group value={project.type} onChange={e => changeValue(e, 'type')} optionType="button"
                    buttonStyle="solid" options={projectTypes} />
                <span>Number of Sprints</span>
                <Grid cols="max-content  max-content max-content" gap={Theme.dimensions.x2} vAlign="center">
                <div><InputNumber min={1} max={100} defaultValue={project.sprints} onChange={e => changeValue({ target: { value: e } }, 'sprints')} /></div>
                {
                project.sprints > 1 && <>
                <span>Show Sprint Timeline</span>
                <div><Switch defaultChecked={UserData.timeline.get} onChange={e=> UserData.timeline.set(e)} /></div>
                </>
                }
                </Grid>
                

                <span>Billing Rate</span>
                <InputNumber min={1} max={10} defaultValue={project.billrate} onChange={e => changeValue({ target: { value: e } }, 'billrate')} />

                <span>Billing Cycle Type</span>
                    <Radio.Group value={project.billcycle} onChange={e => changeValue(e, 'billcycle')} optionType="button"
                        buttonStyle="solid" options={billCycleTypes} />
                
            </Grid>
        </Box>
        </>
    );
}