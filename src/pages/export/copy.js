import dayjs from "dayjs";
import { sprintDuration } from "../../utility/util";


export const copySprintTimeline = data => {
    let string = '';
    data.map((group) => group.map((elem, index) => {
        if (elem.type !== 'invoice') {
            string += `Sprint ${elem.sprint} \t ${dayjs(elem.date, 'DD/MM/YYYY').format('MMM D, YYYY')} \t ${dayjs(elem.date, 'DD/MM/YYYY').add((sprintDuration) - 3, 'day').format('MMM D, YYYY')} \n`;
        }
    }))
    return string
}

export const copyInvoiceDates = data => {
    let string = '';
    data.map((group) => group.map((elem, index) => {
        if (elem.type === 'invoice') {
            string += `${dayjs(elem.date, 'DD/MM/YYYY').format('MMM D, YYYY')} \t ${elem.total.toFixed(2)} \n`;
        }
    }))
    return string
}

export const copyTotals = data => {
    
}

