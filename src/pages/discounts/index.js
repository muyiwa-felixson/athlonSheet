import React, { useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Input, Radio, InputNumber, Switch, Button, Space, Select } from 'antd';
import Cookies from "js-cookie";
import { Box, Grid, Label } from '../../components/layout.style';
import Theme from '../../utility/theme';
import { discountTypes, phaseTravelTypes, range, travelTypes } from '../../utility/util';
import { FiTrash } from 'react-icons/fi';
import { ExtraCostContainer, Table } from '../../components/table.style';

export const ManageDiscounts = props => {
    const UserData = React.useContext(UserContext);
    const phases = UserData.invoice?.get.phases ? UserData.invoice?.get.phases : [];
    const [extracost, setExtracost] = useState(UserData.invoice?.get.extracost ? UserData.invoice.get.extracost : {
        discount: false,
        discountValue: 5,
        travel: 'sprint',
        travelCost: 0,
        travelCosts: [{ cost: 0, sprints: [] }],
        phaseTravelCosts: [{ cost: 0, sprints: [] }],
        research: 'sprint',
        researchCosts: [{ cost: 0, sprints: [] }],
        phaseResearchCosts: [{ cost: 0, sprints: [] }],
        researchCost: 0,
        insurance: false,
    });

    const changeValue = (e, vari) => {
        let newExtracost = { ...extracost };
        newExtracost[vari] = e.target.value;
        setExtracost(newExtracost);
    }
    const changeValueMultiple = (e, i, key, type) => {
        let vari = e;
        let newExtracost = { ...extracost };
        if (key === 'sprints') {
            if (e.includes('all')) {
                vari = range(1, UserData.invoice?.get.project.sprints).map(e => `${e}`);
            }
            newExtracost[type][i][key] = vari.map(e => `${e}`);

            newExtracost[type] = newExtracost[type].map((e, w) => {
                return { ...e, sprints: w === i ? vari : arraySub(e.sprints, vari) };
            })
        } else if (key === 'phases') {
            if (e.includes('all')) {
                vari = phases.map(e => `${e.name}`);
            }
            newExtracost[type][i][key] = vari.map(e => `${e}`);

            newExtracost[type] = newExtracost[type].map((e, w) => {
                return { ...e, phases: w === i ? vari : arraySub(e.phases, vari) };
            })
        } else {
            newExtracost[type][i][key] = vari;
        }
        // console.log("My current Costing", newExtracost);
        setExtracost(newExtracost);
    }

    const addNewDistribution = (type) => {
        let newExtracost = { ...extracost };
        newExtracost[type].push({ cost: 0, sprints: [] });
        setExtracost(newExtracost);
    }
    const deleteDistribution = (i, type) => {
        let newExtracost = { ...extracost };
        newExtracost[type].splice(i, 1);
        setExtracost(newExtracost);
    };

    const arraySub = (mainArray, smallArray) => {
        return mainArray.filter(x => !smallArray.map(e => parseInt(e)).includes(parseInt(x)));
    }

    const filteredSprintOptions = (type) => {
        let initRange = range(1, UserData.invoice?.get.project && UserData.invoice?.get.project.sprints > 0 ? UserData.invoice?.get.project.sprints : []);
        extracost[type].map(e => {
            initRange = e.sprints.length > 0 ? arraySub(initRange, e.sprints) : initRange;
        })
        return initRange.map(e => {
            return { label: `Sprint ${e}`, value: `${e}` }
        });
    }

    const filteredPhaseOptions = (type) => {
        let initRange = phases;
        // extracost[type] && extracost[type].map(e => {
        //     initRange = e.phases ? arraySub(initRange, e.phases) : initRange;
        // })
        // console.log("initial range",initRange);
        return initRange.map(e => {
            return { label: `${e.name}`, value: `${e.name}` }
        });
    }

    const realTravelTypes = (UserData.invoice?.get.project && UserData.invoice.get.project.type === 'fixed') ? phaseTravelTypes : travelTypes;
    // console.log(filteredSprintOptions(), extracost.travelCosts)
    useEffect(() => {
        const newInvoice = { ...UserData.invoice.get, extracost: extracost };
        UserData.invoice.set(newInvoice);
        Cookies.set("invoice", JSON.stringify(newInvoice), { expires: 3 });
    }, [extracost]);
    return (
        <Box pad={['x0', 'x0']}>
            <Box pad={['x2', 'x0']}>
                <h4>Travel</h4>
                <Box pad={['x1']} />
                <Box>
                    <Box>
                        <Label>How would you like to handle Travel costs?</Label>
                        <Radio.Group value={extracost.travel} onChange={e => changeValue(e, 'travel')}>
                            {realTravelTypes.map((e, i) => <Box key={`travel_type_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                        </Radio.Group>
                    </Box>
                    {extracost.travel === 'lumpsum' && <Box>
                        <Label>Travel Amount: </Label>
                        <Space>
                            <Input style={{ width: "150px" }} value={extracost.travelCost} defaultValue={extracost.travelCost} onChange={(e) => changeValue(e, 'travelCost')} placeholder="ex. 10000" />
                            <Button onClick={() => changeValue({ target: { value: 0 } }, 'travelCost')}>Clear</Button>
                        </Space>
                    </Box>}
                    {(extracost.travel === 'sprint' && UserData.invoice?.get.project && UserData.invoice.get.project.type === 'sprint') && <><ExtraCostContainer><Table minified noTile>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '150px' }}>Travel Cost</th>
                                    <th>Sprint Distribution</th>
                                    <th style={{ width: '56px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {extracost.travelCosts && extracost.travelCosts.map((e, i) =>
                                    <tr key={`travel_cost_${i}`}>
                                        <td>
                                            <Input
                                                style={{ width: "100%" }}
                                                value={e.cost}
                                                defaultValue={e.cost}
                                                onChange={(e) => changeValueMultiple(e.target.value, i, 'cost', 'travelCosts')}
                                                placeholder="ex. 10000"
                                            />
                                        </td>
                                        <td>
                                            <Select
                                                style={{ minWidth: "100%" }}
                                                defaultValue={e.sprints}
                                                value={e.sprints ? e.sprints : []}
                                                mode="multiple"
                                                placeholder="Select Sprints"
                                                allowClear
                                                options={i === 0 ? [{ label: 'All Sprints', value: 'all' }, ...filteredSprintOptions('travelCosts')] : filteredSprintOptions('travelCosts')}
                                                onChange={e => changeValueMultiple(e, i, 'sprints', 'travelCosts')}
                                            />
                                        </td>
                                        <td>{i > 0 && <Button onClick={() => { deleteDistribution(i, 'travelCosts') }} icon={<FiTrash />} />}</td>
                                    </tr>)}
                            </tbody></table></Table></ExtraCostContainer>
                        <Button type="primary" ghost disabled={!filteredSprintOptions('travelCosts').length > 0} style={{ borderRadius: Theme.primary.radius }} size="medium" onClick={() => addNewDistribution('travelCosts')}>New Distribution</Button>
                    </>}

                    {(extracost.travel === 'sprint' && UserData.invoice?.get.project && UserData.invoice.get.project.type === 'fixed') && <><ExtraCostContainer><Table minified noTile>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '150px' }}>Travel Cost</th>
                                    <th>Phase Distribution</th>
                                    <th style={{ width: '56px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {extracost.phaseTravelCosts && extracost.phaseTravelCosts.map((e, i) =>
                                    <tr key={`travel_cost_${i}`}>
                                        <td>
                                            <Input
                                                style={{ width: "100%" }}
                                                defaultValue={e.cost}
                                                value={e.cost}
                                                onChange={(e) => changeValueMultiple(e.target.value, i, 'cost', 'phaseTravelCosts')}
                                                placeholder="ex. 10000"
                                            />
                                        </td>
                                        <td>
                                            <Select
                                                style={{ minWidth: "100%" }}
                                                defaultValue={e.phases}
                                                value={e.phases ? e.phases : []}
                                                mode="multiple"
                                                placeholder="Select Phases"
                                                allowClear
                                                options={i === 0 ? [{ label: 'All Phases', value: 'all' }, ...filteredPhaseOptions('phaseTravelCosts')] : filteredPhaseOptions('phaseTravelCosts')}
                                                onChange={e => changeValueMultiple(e, i, 'phases', 'phaseTravelCosts')}
                                            />
                                        </td>
                                        <td>{i > 0 && <Button onClick={() => { deleteDistribution(i, 'phaseTravelCosts') }} icon={<FiTrash />} />}</td>
                                    </tr>)}
                            </tbody></table></Table></ExtraCostContainer>
                        <Button type="primary" ghost disabled={!filteredPhaseOptions('phaseTravelCosts').length > 0} style={{ borderRadius: Theme.primary.radius }} size="medium" onClick={() => addNewDistribution('phaseTravelCosts')}>New Distribution</Button>
                    </>}
                </Box>

            </Box>

            <Box pad={['x2', 'x0']}>
                <h4>Research</h4>
                <Box pad={['x1']} />
                <Box width="800px">
                    <Box>
                        <Label>How would you like to handle Research costs?</Label>
                        <Radio.Group value={extracost.research} onChange={e => changeValue(e, 'research')}>
                            {realTravelTypes.map((e, i) => <Box key={`research_type_${i}`} pad={['x1', 'x0']}><Radio disabled={e.disabled} value={e.value}>{e.label}</Radio></Box>)}
                        </Radio.Group>
                    </Box>
                    {extracost.research === 'lumpsum' && <Box>
                        <Label>Research Amount: </Label>
                        <Space>
                            <Input style={{ width: "150px" }} value={extracost.researchCost} defaultValue={extracost.researchCost} onChange={(e) => changeValue(e, 'researchCost')} placeholder="ex. 10000" />
                            <Button onClick={() => changeValue({ target: { value: 0 } }, 'researchCost')}>Clear</Button>
                        </Space>
                    </Box>}
                    {(extracost.research === 'sprint' && UserData.invoice?.get.project && UserData.invoice.get.project.type === 'sprint') && <><ExtraCostContainer><Table minified noTile>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '150px' }}>Research Cost</th>
                                    <th>Sprint Distribution</th>
                                    <th style={{ width: '56px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {extracost.researchCosts && extracost.researchCosts.map((e, i) => <tr key={`travel_cost_${i}`}>
                                    <td> <Input
                                        style={{ width: "100%" }}
                                        value={e.cost}
                                        defaultValue={e.cost}
                                        onChange={(e) => changeValueMultiple(e.target.value, i, 'cost', 'researchCosts')}
                                        placeholder="ex. 10000"
                                    /></td>
                                    <td> <Select
                                        style={{ minWidth: "100%" }}
                                        defaultValue={e.sprints}
                                        value={e.sprints ? e.sprints : []}
                                        mode="multiple"
                                        placeholder="Select Sprints"
                                        allowClear
                                        options={i === 0 ? [{ label: 'All Sprints', value: 'all' }, ...filteredSprintOptions('researchCosts')] : filteredSprintOptions('researchCosts')}
                                        onChange={e => changeValueMultiple(e, i, 'sprints', 'researchCosts')}
                                    />
                                    </td>
                                    <td>{i > 0 && <Button onClick={() => { deleteDistribution(i, 'researchCosts') }} icon={<FiTrash />} />}</td>
                                </tr>)}
                            </tbody></table></Table></ExtraCostContainer>
                        <Button type="primary" ghost disabled={!filteredSprintOptions('researchCosts').length > 0} style={{ borderRadius: Theme.primary.radius }} size="medium" onClick={() => addNewDistribution('researchCosts')}>New Distribution</Button>
                    </>
                    }

                    {(extracost.research === 'sprint' && UserData.invoice?.get.project && UserData.invoice.get.project.type === 'fixed') && <><ExtraCostContainer><Table minified noTile>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '150px' }}>Research Cost</th>
                                    <th>Phase Distribution</th>
                                    <th style={{ width: '56px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {extracost.phaseResearchCosts && extracost.phaseResearchCosts.map((e, i) =>
                                    <tr key={`travel_cost_${i}`}>
                                        <td>
                                            <Input
                                                style={{ width: "100%" }}
                                                defaultValue={e.cost}
                                                value={e.cost}
                                                onChange={(e) => changeValueMultiple(e.target.value, i, 'cost', 'phaseResearchCosts')}
                                                placeholder="ex. 10000"
                                            />
                                        </td>
                                        <td>
                                            <Select
                                                style={{ minWidth: "100%" }}
                                                defaultValue={e.phases}
                                                value={e.phases ? e.phases : []}
                                                mode="multiple"
                                                placeholder="Select Phases"
                                                allowClear
                                                options={i === 0 ? [{ label: 'All Phases', value: 'all' }, ...filteredPhaseOptions('phaseResearchCosts')] : filteredPhaseOptions('phaseResearchCosts')}
                                                onChange={e => changeValueMultiple(e, i, 'phases', 'phaseResearchCosts')}
                                            />
                                        </td>
                                        <td>{i > 0 && <Button onClick={() => { deleteDistribution(i, 'phaseResearchCosts') }} icon={<FiTrash />} />}</td>
                                    </tr>)}
                            </tbody></table></Table></ExtraCostContainer>
                        <Button type="primary" ghost disabled={!filteredPhaseOptions('phaseResearchCosts').length > 0} style={{ borderRadius: Theme.primary.radius }} size="medium" onClick={() => addNewDistribution('phaseResearchCosts')}>New Distribution</Button>
                    </>}
                </Box>
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