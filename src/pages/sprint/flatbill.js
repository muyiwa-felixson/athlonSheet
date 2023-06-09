import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import dayjs from 'dayjs';
import {  sprintDuration } from '../../utility/util';

const defaultCurrency = process.env.REACT_APP_CURRENCY;

const FlatBillTable = () => {
    const { invoice, data, sheet, excluded } = useContext(UserContext);
    const phases = invoice?.get.phases;

    const currency = invoice.get.project.useCurrency ? invoice.get.project.useCurrency : `${defaultCurrency}${defaultCurrency}`;
    // const shortCurrency = currency.slice(3);
    const currencyData = invoice?.get.project.currencyData?.quotes ? invoice?.get.project.currencyData?.quotes : [];
    const currencyRate = (currencyData.find(e=> e.currency === currency) && currencyData.find(e=> e.currency === currency).value) ? currencyData.find(e=> e.currency === currency).value : 1;

    const getGroup = (name) => {
        return phases.find(group => group.name === name) || null;
    }

    const project = invoice.get.project || {};
    const extracost = invoice.get.extracost || {};

    const getMemberCost = (member) => {
        const rateCard = data.rateCard?.get || [];
        const lineRate = rateCard.find((e) => e.role === member) || {};
        return lineRate[`${invoice.get.customer.type}_daily`];
    };

    const getWeekDays = (duration) =>{
        let weeks = Math.floor(duration/5);
        let days = duration % 5;

        return {
            week: weeks,
            day: days
        }
    }

    const spreadSprint = () => {
        const { date } = project;
        let phaseItems = [];
        let startDate = date;


        phases.map((phase, index) => {
            // console.log("week days:", getWeekDays(phase.duration));
            const endDate = dayjs(startDate, 'DD/MM/YYYY').add(getWeekDays(phase.duration).week, 'week').add(getWeekDays(phase.duration).day, 'day');
            const discount = extracost.discount;
            const discountValue = extracost.discountValue;

            const travel = extracost.travel;
            const travelCost = extracost.phaseTravelCosts?.find(e => e.phases?.includes(phase.name)) ? extracost.phaseTravelCosts?.find(e => e.phases.includes(phase.name)).cost * currencyRate : 0;
            const research = extracost.research;
            const researchCost = extracost.phaseResearchCosts?.find(e => e.phases?.includes(phase.name)) ? extracost.phaseResearchCosts?.find(e => e.phases.includes(phase.name)).cost * currencyRate : 0;
            
            // console.log("travels and research", travelCost, researchCost);
            const phaseDiscount = discount ? discountValue : 0;
            let phaseCost = 0;
            let personnelCost = 0;
            let phaseDiscounted = 0; 

            getGroup(phase.name)?.members.map((mem, inc)=> {
                personnelCost += parseInt(getMemberCost(mem.role) *  mem.commitment || 0) * currencyRate;
            })

            phaseCost = personnelCost;

            if (discount === 'total') {
                phaseCost = phaseCost + parseFloat(travelCost);
            }
            if (discount === 'total') {
                phaseCost = phaseCost + parseFloat(researchCost);
            }

            phaseDiscounted = (phaseDiscount ? phaseCost * (discountValue) / 100 : 0);
            phaseCost = (phaseCost - phaseDiscounted);

            if (discount !== 'total') {
                phaseCost = phaseCost + parseFloat(travelCost);
            }
            if (discount !== 'total') {
                phaseCost = phaseCost + parseFloat(researchCost);
            }


            phaseItems.push({
                type: 'phase',
                name: phase.name,
                date: startDate,
                endDate: endDate,
                cost: phaseCost,
                personnel: personnelCost,
                travel: travelCost,
                research: researchCost,
                members: getGroup(phase.name)?.members.map((member) => ({ name: member.name, role: member.role, commitment: member.commitment, cost: parseInt(getMemberCost(member.role) *  member.commitment || 0) })),
                discount: phaseDiscount,
                discountValue: phaseDiscounted
            })

            startDate = endDate;
        })

        sheet.set(phaseItems);
        // console.log(invoice.get);
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

export default FlatBillTable;
