import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { Box } from '../../components/layout.style';
import dayjs from 'dayjs';
import { BillBox, BillCard, GroupCard } from '../../components/invoiceCards.style';
import { Avatar, Table, Tag, Modal } from 'antd';
import { getFirstTwoLetters } from '../../components/input.style';
import { UpdateMembers } from './update.members';
import Theme from '../../utility/theme';
import { sprintDuration } from '../../utility/util';

const SprintTable = () => {
    const { invoice, data, sheet, excluded } = useContext(UserContext);
    const [modal, setModal] = useState(false);
    const [editState, setEditState] = useState(null);

    const popModal = (index, element) => {
        setEditState({ index: index, element: element })
        setModal(true);
    }
    const closeModal = () => {
        setEditState(null)
        setModal(false);
        spreadSprint();
    }


    const project = invoice.get.project || {};
    const extracost = invoice.get.extracost || {};

    const getMemberCost = (member) => {
        const rateCard = data.rateCard?.get || [];
        const lineRate = rateCard.find((e) => e.role === member) || {};
        return lineRate[`${invoice.get.customer.type}_daily`];
    };

    const spreadSprint = () => {
        const { sprints, billrate, billcycle, date } = project;
        let sprintGroup = [];
        let sprintItems = [];
        let g = 0;
        let total = 0;
        let groupTotal = 0;
        let projectTotal = 0;
        let projectCost = 0;
        let groupCost = 0;
        let groupTravel = 0;
        let groupResearch = 0;
        let startDate = date;

        for (let i = 0; i < sprints; i++) {
            const sprintDate = dayjs(date, 'DD/MM/YYYY').add(14 * i, 'day').format('DD/MM/YYYY');
            const discount = extracost.discount;
            const discountValue = extracost.discountValue;
            const discountAt = extracost.discountAt;
            const travel = extracost.travel;
            const travelCost = extracost.travel === 'sprint' ? extracost.travelCost : 0;
            const travelDiscount = extracost.travelDiscount;
            const research = extracost.research;
            const researchCost = extracost.research === 'sprint' ? extracost.researchCost : 0;
            const researchDiscount = extracost.researchDiscount;
            const insurance = extracost.insurance;

            const sprintDiscount = discount && i + 1 >= discountAt ? discountValue : 0;
            let sprintCost = 0;
            let personnelCost = 0;
            let sprintDiscounted = 0;

            // get single sprint cost based on members

            const sprintMembers = invoice.get.members || [];
            sprintMembers.forEach((member, inc) => {
                if (excluded.get[`sprint_${i + 1}`] && excluded.get[`sprint_${i + 1}`][inc] && !excluded.get[`sprint_${i + 1}`][inc].active) {
                    personnelCost += 0;
                } else {
                    personnelCost += parseInt(getMemberCost(member.role) || 0);
                }
            });
            // COST AGGREGATION
            sprintCost = sprintCost + personnelCost;
            // if travel cost applies before discount
            if (travel === 'sprint' && travelDiscount) {
                sprintCost = sprintCost + parseInt(travelCost);
            }
            if (research === 'sprint' && researchDiscount) {
                sprintCost = sprintCost + parseInt(researchCost);
            }
            sprintDiscounted = (sprintDiscount ? sprintCost * (discountValue) / 100 : 0);
            sprintCost = (sprintDiscount ? sprintCost * (100 - discountValue) / 100 : sprintCost);

            // console.log(travel, research);
            // If travel and research is not affected by discount
            if (travel === 'sprint' && !travelDiscount) {
                sprintCost = sprintCost + parseInt(travelCost);
            }
            if (research === 'sprint' && !researchDiscount) {
                sprintCost = sprintCost + parseInt(researchCost);
            }

            // group total including discounts
            groupTotal = groupTotal + sprintCost;
            // Group total without discounts
            groupCost = groupCost + personnelCost;
            groupTravel += parseInt(travelCost);
            groupResearch += parseInt(researchCost);

            // Project Total with discount and with out
            projectTotal = projectTotal + groupTotal;
            projectCost = projectCost + sprintCost;


            if (g === 0) {
                startDate = sprintDate;
            }
            g++;
            sprintItems.push({
                type: 'sprint',
                sprint: i + 1,
                date: sprintDate,
                cost: sprintCost,
                personnel: personnelCost,
                travel: travelCost,
                research: researchCost,
                members: sprintMembers.map((member) => ({ name: member.name, role: member.role, cost: getMemberCost(member.role) })),
                discount: sprintDiscount,
                discountValue: sprintDiscounted
            });

            if (g === billrate || i === sprints - 1) {
                g = 0;
                if (billcycle === 'start') {
                    const nextFriday = (5 - dayjs(sprintDate, 'DD/MM/YYYY').day() + 7) % 7;
                    sprintItems.unshift({ type: 'invoice', cost: groupCost, total: groupTotal, date: startDate, travel: groupTravel, research: groupResearch, discount: (groupCost + groupTravel + groupResearch) - groupTotal });
                } else {
                    const nextFriday = (5 - dayjs(sprintDate, 'DD/MM/YYYY').day() + 7) % 7;
                    sprintItems.push({ type: 'invoice', cost: groupCost, total: groupTotal, date: dayjs(sprintDate, 'DD/MM/YYYY').add(sprintDuration, 'day').add(nextFriday, 'day').format('DD/MM/YYYY'), travel: groupTravel, research: groupResearch, discount: (groupCost + groupTravel + groupResearch) - groupTotal });
                }
                sprintGroup.push(sprintItems);
                sprintItems = [];
                total = 0;
                groupTotal = 0;
                sprintCost = 0;
                groupCost = 0;
                groupResearch = 0;
                groupTravel = 0;
            }
        }

        sheet.set(sprintGroup);
    };
    useEffect(() => {
        // console.log("invoice changed");
        spreadSprint();
    }, [invoice.get]);
    return (
        <>
            <Box pad={['x4', 'x4']}>
                {

                    sheet.get.length > 0 && sheet.get?.map((el, i) => {
                        const bill = el.find(e => e.type === 'invoice');
                        return <GroupCard key={`sprinttable_${i}`}>
                            <BillCard>
                                <BillBox>
                                    <Tag color="green">Invoice Date</Tag>
                                    <div><strong>{bill.date}</strong></div>
                                </BillBox>
                                <BillBox>
                                    <Tag color="volcano">Cost</Tag>
                                    <div><strong>{bill.cost}</strong></div>
                                </BillBox>
                                <BillBox>
                                    <Tag color="red">Travel</Tag>
                                    <div><strong>{bill.travel}</strong></div>
                                </BillBox>
                                <BillBox>
                                    <Tag color="red">Research</Tag>
                                    <div><strong>{bill.research}</strong></div>
                                </BillBox>
                                <BillBox>
                                    <Tag color="red">Discount</Tag>
                                    <div><strong>-{bill.discount}</strong></div>
                                </BillBox>
                                <BillBox>
                                    <Tag color="blue">Total</Tag>
                                    <div><strong>${bill.total}</strong></div>
                                </BillBox>
                            </BillCard>
                            <Table
                                rowKey={(e) => `table_${e.sprint}_sprintTable`}
                                columns={[
                                    {
                                        title: "Date",
                                        dataIndex: 'date',
                                        render: (v, row) => <span>{v}</span>
                                    },
                                    {
                                        title: "Sprint",
                                        dataIndex: 'sprint',
                                        render: (v, row) => <strong>Sprint {v}</strong>
                                    },
                                    {
                                        title: "Personnel Cost",
                                        dataIndex: 'personnel',
                                        render: (v, row) => <span>${v}</span>
                                    },
                                    {
                                        title: "Members",
                                        dataIndex: 'members',
                                        render: (v, row, i) => <div onDoubleClick={() => popModal(i, row)}>{row.members.map((elem, ind) => <Avatar style={{ margin: '2px', fontSize: '12px', backgroundColor: excluded.get[`sprint_${row.sprint}`] && excluded.get[`sprint_${row.sprint}`][ind] && !excluded.get[`sprint_${row.sprint}`][ind].active ? '#ddd' : 'blue' }} size={20} key={`member_${row.sprint}_${ind}`}>{getFirstTwoLetters(elem.role)}</Avatar>)}</div>,
                                    },
                                    {
                                        title: "Travel",
                                        dataIndex: 'travel'
                                    },
                                    {
                                        title: "Research",
                                        dataIndex: 'research'
                                    },
                                    {
                                        title: "Discount %",
                                        dataIndex: 'discount',
                                        render: (v, row) => <span>{v}%</span>
                                    },
                                    {
                                        title: "Discount",
                                        dataIndex: 'discount',
                                        render: (v, row) => <span>{row.discountValue && `-${row.discountValue}`}</span>
                                    },
                                    {
                                        title: "Total",
                                        render: (row) => <strong>{row.cost}</strong>
                                    }
                                ]}
                                dataSource={el.filter(e => e.type === 'sprint')}
                                size="small" bordered pagination={false} shouldCellUpdate />
                        </GroupCard>
                    })
                }
            </Box>
            <Modal title={null} open={modal} footer={null} closable={false} destroyOnClose={true} bodyStyle={{ padding: Theme.dimensions.x1 }} width={400}>
                {modal && <UpdateMembers {...editState} closeModal={closeModal} />}
            </Modal>
        </>
    );
};

export default SprintTable;
