import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import dayjs from 'dayjs';
import {  sprintDuration } from '../../utility/util';

const SprintTable = () => {
    const { invoice, data, sheet, excluded } = useContext(UserContext);
    const loading = invoice?.get.loading;

    const getGroup = (sprint) => {
        return loading.find(group => group.to >= sprint) || null;
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
            const travel = extracost.travel;
            const travelCost = extracost.travel === 'sprint' ? extracost.travelCost : 0;
            const research = extracost.research;
            const researchCost = extracost.research === 'sprint' ? extracost.researchCost : 0;
            // const insurance = extracost.insurance;

            // console.log();

            const sprintDiscount = discount ? discountValue : 0;
            let sprintCost = 0;
            let personnelCost = 0;
            let sprintDiscounted = 0; 

            // get single sprint cost based on members

            getGroup(i+1)?.members.map((mem, inc)=> {
                // console.log('sprint ', i+1, 'member: ', mem.role, 'cost: ',parseInt(getMemberCost(mem.role) *  mem.commitment || 0))
                personnelCost += parseInt(getMemberCost(mem.role) *  mem.commitment || 0);
            })
            // COST AGGREGATION
            sprintCost = sprintCost + personnelCost;
            // if travel cost applies before discount
            if (travel === 'sprint' && discount === 'total') {
                sprintCost = sprintCost + parseInt(travelCost);
            }
            if (research === 'sprint' && discount === 'total') {
                sprintCost = sprintCost + parseInt(researchCost);
            }
            sprintDiscounted = (sprintDiscount ? sprintCost * (discountValue) / 100 : 0);
            sprintCost = (sprintCost - sprintDiscounted);

            // console.log(travel, research);
            // If travel and research is not affected by discount
            if (travel === 'sprint' && discount === 'team') {
                sprintCost = sprintCost + parseInt(travelCost);
            }
            if (research === 'sprint' && discount === 'team') {
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
                members: getGroup(i+1)?.members.map((member) => ({ name: member.name, role: member.role, commitment: member.commitment, cost: parseInt(getMemberCost(member.role) *  member.commitment || 0) })),
                discount: sprintDiscount,
                discountValue: sprintDiscounted
            });

            if (g === billrate || i === sprints - 1) {
                g = 0;
                if (billcycle === 'start') {
                    sprintItems.unshift({ type: 'invoice', cost: groupCost, total: groupTotal, date: startDate, travel: groupTravel, research: groupResearch, discount: (groupCost + groupTravel + groupResearch) - groupTotal });
                } else {
                    const nextFriday = (5 - dayjs(sprintDate, 'DD/MM/YYYY').day() + 3) % 7;
                    sprintItems.push({ type: 'invoice', cost: groupCost, total: groupTotal, date: dayjs(sprintDate, 'DD/MM/YYYY').add(sprintDuration - 3, 'day').add(nextFriday, 'day').format('DD/MM/YYYY'), travel: groupTravel, research: groupResearch, discount: (groupCost + groupTravel + groupResearch) - groupTotal });
                }
                sprintGroup.push(sprintItems);
                sprintItems = [];
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
        spreadSprint();
    }, [invoice.get]);
    return (
        <>
        Sheet Spread run
        </>
    );
};

export default SprintTable;
