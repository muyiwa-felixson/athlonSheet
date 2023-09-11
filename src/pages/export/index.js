import { useContext, useRef, useState } from "react"
import { UserContext } from "../../App";
import ReactToPrint from 'react-to-print';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import dayjs from 'dayjs';
import Theme from "../../utility/theme";
import { AthlonSheet, SheetHeader, Table } from "../../components/table.style";
import { Empty, Space, Button, Dropdown, message } from "antd";
import { Box, Grid } from "../../components/layout.style";
import Logo from "../../assets/logo";
import { FiChevronDown, FiColumns, FiCopy, FiDownload, FiFile, FiPrinter, FiSave } from "react-icons/fi";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DropLine } from "../../components/input.style";
import { currencies, sprintDuration } from "../../utility/util";
import { copyInvoiceDates, copySprintTimeline, copyTotals } from "./copy";

const defaultCurrency = process.env.REACT_APP_CURRENCY;

const ExportInvoice = props => {
    const UserData = useContext(UserContext);
    // const [messageApi, contextHolder] = message.useMessage();
    // const [invoiceText, setInvoiceText] = useState(''); 
    // const [sprintTimelineText, setSprintTimelineText] = useState(''); 
    // const [totalsText, setTotalsText] = useState(''); 

    const excluded = UserData.excluded;
    const extracost = UserData.invoice.get.extracost ? UserData.invoice.get.extracost : null;
    const printable = useRef();
    const dataTable = useRef(null);

    const currency = UserData.invoice.get.project.useCurrency ? UserData.invoice.get.project.useCurrency : `${defaultCurrency}${defaultCurrency}`;
    const shortCurrency = currency.slice(3);
    const currencyData = UserData.invoice?.get.project.currencyData?.quotes ? UserData.invoice?.get.project.currencyData?.quotes : [];
    const currencyRate = (currencyData.length > 0 && currencyData.find(e => e.currency === currency).value) ? currencyData.find(e => e.currency === currency).value : 1;

    let total = {
        cost: 0,
        discount: 0,
        personnel: 0,
        travel: extracost?.travel === 'lumpsum' ? parseInt(extracost.travelCost) * currencyRate : 0,
        research: extracost?.research === 'lumpsum' ? parseInt(extracost.researchCost) * currencyRate : 0,
        insurance: 0,
    };
    total.cost += total.travel + total.research;
    const handleDownloadPdf = async () => {
        const element = printable.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight =
            (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('print.pdf');
    };

    const handleFileDownload = () => {
        const jsonData = { invoice: UserData.invoice.get, rateCard: UserData.data?.rateCard.get };
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${UserData.invoice?.get.customer?.name}_${UserData.invoice?.get.project?.name}_${dayjs(dayjs(), 'DD/MM/YYYY').format('MMM D, YYYY')}.athlon`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const items = [{
        key: '1', label: (<DropLine><FiFile /><span onClick={handleDownloadPdf}>Download PDF</span></DropLine>)
    },
    {
        key: '2', label: (<DownloadTableExcel
            filename={`Athlon Sheet: ${UserData.invoice?.get.customer?.name}_${UserData.invoice?.get.project?.name}`}
            sheet="Invoice"
            currentTableRef={dataTable.current}
        >
            <DropLine><FiColumns /><span> Download Excel </span></DropLine></DownloadTableExcel>)
    }, { key: '3', label: (<DropLine highlight><FiSave /><span onClick={handleFileDownload}>Download Invoice File</span></DropLine>) }];

    const copyItems = [
        { key: '1', label: (<DropLine><FiCopy /><span onClick={()=> handleCopy(sprintTimelineText, "Sprint timeline")}>Copy Sprint Timelines</span></DropLine>)},
        { key: '2', label: (<DropLine><FiCopy /><span onClick={()=> handleCopy(invoiceText, "Invoice dates & costs")}>Copy Invoice Cost & Dates</span></DropLine>)},
        // { key: '3', label: (<DropLine><FiCopy /><span onClick={()=> handleCopy('', '')}>Copy Full Table</span></DropLine>)},
        { key: '4', label: (<DropLine><FiCopy /><span onClick={()=> handleCopy(totalsText, "Total breakdown")}>Copy Total Breakdown</span></DropLine>)},
    ];


    const handleCopy = (content, copyType) => {
        const type = "text/plain";
        const blob = new Blob([content], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        navigator.clipboard.write(data).then(
            () => {
                message.info(`${copyType} copied!`);
            }, () => {
                message.warning('copy failed')
            }
        )
    }
    let invoiceText=''; 
    let sprintTimelineText = ''; 
    let totalsText = '';
    const updateInvoiceText = content => {
        invoiceText+= content;
    }
    const updateSprintTimelineText = content => {
        sprintTimelineText += content;
    }

    const updateTotalsText = content => {
        totalsText += content;
    }
    let GroupFYP = [];
    let CalculatedGroupTotals = [];
    
    UserData.sheet.get.map((group) => group.map((elem, index) => {
        if (elem.type === 'invoice') {
            total.personnel += parseFloat(elem.cost);
            total.cost += parseFloat(elem.total);
            total.travel += parseFloat(elem.travel);
            total.research += parseFloat(elem.research);
            
            GroupFYP.push({date: elem.date, total: parseFloat(elem.total)});
        }    
    }));
    
    total.discount = extracost.discount && extracost.discount !== 'false' ? (extracost.discount === 'team' ? total.personnel  : total.cost) * extracost.discountValue/100 : 0;
    let discountRemain  = total.discount;
    total.cost = total.cost  - total.discount;
    GroupFYP.reverse().map((elem)=>{   
        if(elem.total < discountRemain){
            CalculatedGroupTotals.push({date: elem.date, total: 0, discount: elem.total});
            discountRemain = discountRemain - elem.total;
        } else {
            CalculatedGroupTotals.push({date: elem.date, total: elem.total - discountRemain, discount: discountRemain});
            discountRemain = 0;
        }
    })

    return <>
        {/* <div style={{ display: 'none' }} ><SprintTable /></div> */}
        {UserData.sheet?.get.length > 0 && <>
            <SheetHeader>
                <Grid cols="auto max-content" className="sheetHeader">
                    <Box></Box>
                    <Box pad={['x2', 'x0']}>
                        <Space>
                            
                            <Dropdown.Button size="large" arrow menu={{ items: copyItems }} icon={<span style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '5px'}}><FiChevronDown /></span>}><span>Copy</span></Dropdown.Button>
                            <Dropdown menu={{ items }}><span onClick={(e) => e.preventDefault()}><Button type="primary" size="large" style={{ borderRadius: Theme.primary.radius }} icon={<FiDownload />}>Download</Button></span></Dropdown>
                            <ReactToPrint
                                trigger={() => <Button type="primary" size="large" style={{ borderRadius: Theme.primary.radius }} icon={<FiPrinter />}>Print</Button>}
                                content={() => printable.current}
                            />
                            <Button size="large" onClick={props.onClose}>Close</Button>
                        </Space>
                    </Box>
                </Grid>
            </SheetHeader>
            <AthlonSheet className="athlonSheet" ref={printable} id="printable">
                <Box pad={['x3']}>
                    <Grid cols="auto max-content">
                        <Box>
                            <Logo wide="true" style={{ height: Theme.dimensions.x8 }} />
                        </Box>
                        <Box>
                            {/* <h4>Athlon Sheet</h4> */}
                        </Box>
                    </Grid>
                    {UserData.sheet?.get.length > 0 && <Box pad={['x3', 'x0']}>
                        <Grid cols="1fr 2fr" gap={`${Theme.dimensions.x9}`} style={{ alignItems: 'start' }}>
                            <Grid cols="max-content auto" gap={`${Theme.dimensions.x1} ${Theme.dimensions.x2}`}>
                                <span>Client: </span><strong>{UserData.invoice.get.customer.name}</strong>
                                <span>Contact: </span><div><strong>{UserData.invoice.get.customer.contactName}</strong><br /><strong>{UserData.invoice.get.customer.contactEmail}</strong></div>
                                <span>Project: </span><strong>{UserData.invoice.get.project.name}</strong>
                                <span>Start: </span><strong>{dayjs(UserData.invoice.get.project.date, 'DD/MM/YYYY').format('MMM D, YYYY')}</strong>
                            </Grid>
                            <Grid cols="max-content auto" gap={`${Theme.dimensions.x1} ${Theme.dimensions.x2}`}>
                                <span>Date Created: </span><strong>{dayjs(dayjs(), 'DD/MM/YYYY').format('MMM D, YYYY')}</strong>
                                <span>Created By: </span><div><strong>{UserData.profile?.get.name}</strong></div>
                                <span>Currency: </span><div><strong>{currencies.find(e => e.value === currency).label}</strong></div>
                            </Grid>
                        </Grid>
                    </Box>
                    }
                    {UserData.sheet?.get.length > 0 ? <Table><table ref={dataTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th></th>
                                <th>Members</th>
                                <th className="alignR">Personnel</th>
                                <th className="alignR">Travel</th>
                                <th className="alignR">Research</th>
                                <th colSpan={extracost.insurance ? 1 : 2} className="alignR">Sub Total</th>
                                <th className="alignR">Discount</th>
                                {extracost.insurance && <th className="alignR">Insurance</th> }
                                <th className="alignR">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                UserData.sheet.get.map((group) => group.map((elem, index) => {
                                    const realTotal = CalculatedGroupTotals.find(groupitem => groupitem.date === elem.date);
                                    let insurance = 0;
                                    if (elem.type === 'invoice') {
                                        insurance = extracost.insurance ? realTotal.total * 0.05 : 0;
                                        total.insurance += insurance;
                                        updateInvoiceText(`${dayjs(elem.date, 'DD/MM/YYYY').format('MMM D, YYYY')} \t ${(realTotal.total + insurance).toFixed(2)} \n`);
                                    } else {
                                        updateSprintTimelineText(`Sprint ${elem.sprint} \t ${dayjs(elem.date, 'DD/MM/YYYY').format('MMM D, YYYY')} \t ${dayjs(elem.date, 'DD/MM/YYYY').add((sprintDuration) - 3, 'day').format('MMM D, YYYY')} \n`)
                                    }
                                    const Row = elem.type === 'invoice' ? <tr className="invoiceRow" key={`sheet_${elem.type}_${index}`}>
                                        <td>{dayjs(elem.date, 'DD/MM/YYYY').format('MMM D, YYYY')}</td>
                                        <td colSpan={2}>INVOICE</td>
                                        <td className="alignR">{elem.cost.toFixed(2)}</td>
                                        <td className="alignR">{elem.travel.toFixed(2)}</td>
                                        <td className="alignR">{elem.research.toFixed(2)}</td>
                                        <td colSpan={extracost.insurance ? 1 : 2} className="alignR totalColumn">{elem.total.toFixed(2)}</td>
                                        <td className="alignR">{extracost.discount && realTotal.discount > 0 ? `-${realTotal.discount.toFixed(2)}` : ''}</td>
                                        { extracost.insurance &&  <td className="alignR">{(realTotal.total * 0.05 ).toFixed(2)}</td> }
                                        <td className="alignR"><strong>{(realTotal.total + insurance).toFixed(2)}</strong></td>
                                    </tr> : <tr key={`sheet_${elem.type}_${index}`}>
                                        <td>{elem.date}</td>
                                        <td>Sprint {elem.sprint}</td>
                                        <td>{elem.members?.length}</td>
                                        <td className="alignR">{elem.cost.toFixed(2)}</td>
                                        <td className="alignR">{elem.travel.toFixed(2)}</td>
                                        <td className="alignR">{elem.research.toFixed(2)}</td>
                                        <td colSpan={extracost.insurance ? 1 : 2} className="alignR totalColumn">{(elem.total).toFixed(2)}</td>
                                        { extracost.insurance &&  <td className="alignR"></td> }
                                        <td className="alignR"></td>
                                        <td className="alignR"></td>
                                    </tr>;
                                    return Row;
                                })
                                )
                            }
                        </tbody>
                        <tbody className="totalBody">
                            <tr>
                                <td colSpan={9} className="alignR"><em>Total Personnel Cost</em></td>
                                <td className="alignR">{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.personnel)}</td>
                            </tr>
                            <tr>
                                <td colSpan={9} className="alignR"><em>Travels</em></td>
                                <td className="alignR">{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.travel)}</td>
                            </tr>
                            <tr>
                                <td colSpan={9} className="alignR"><em>Research Incentives</em></td>
                                <td className="alignR">{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.research)}</td>
                            </tr>
                            <tr>
                                <td colSpan={9} className="alignR"><em>Discount</em></td>
                                <td className="alignR">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.discount)}</td>
                            </tr>
                            {
                                extracost?.insurance && <>
                                    <tr>
                                        <td colSpan={9} className="alignR"><strong>TOTAL</strong></td>
                                        <td className="alignR"><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.cost)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={9} className="alignR"><em>Payment Insurance (5% of total)</em></td>
                                        <td className="alignR"><em>{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.insurance)}</em></td>
                                    </tr>
                                </>
                            }
                            <tr className="totalRow">
                                <td colSpan={9} className="alignR"><strong>NET TOTAL</strong></td>
                                <td className="alignR"><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format((extracost?.insurance ? total.cost + (total.cost * 5 / 100) : total.cost))}</strong></td>
                            </tr>
                        </tbody>
                        {
                            updateTotalsText(`Total Personnel Cost \t ${new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.personnel)}
                            Travels \t ${new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.travel)}
                            Research Incentives \t ${new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.research)}
                            Discount \t ${new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.discount)}
                            ${ extracost.insurance ? `Payment Insurance (5% of total) \t ${new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format(total.cost * 5 / 100)}` : `` }
                            Total \t ${new Intl.NumberFormat('en-US', { style: 'currency', currency: shortCurrency }).format((extracost?.insurance ? total.cost + (total.cost * 5 / 100) : total.cost))}`)
                        }
                    </table></Table> : <Box pad={['x4']}><Empty description={<p><strong>No Data</strong><br />Please provide complete information for invoice fields</p>} /></Box>
                    }
                    <br />
                    {UserData.invoice?.get.project.useCurrency !== `${defaultCurrency}${defaultCurrency}` && <em>(As on {dayjs.unix(UserData.invoice?.get.project.currencyData?.timestamp).format('H:mm Do MMMM')})  1 {defaultCurrency} = {currencyRate} {currencies.find(e => e.value === currency).label}</em>}
                </Box>
                {/* <span>{invoiceText}</span> */}
            </AthlonSheet>
        </>}
    </>
}
export default ExportInvoice;