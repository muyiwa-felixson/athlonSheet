import { useContext, useRef } from "react"
import { UserContext } from "../../App";
import ReactToPrint from 'react-to-print';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import dayjs from 'dayjs';
import Theme from "../../utility/theme";
import { AthlonSheet, FreeTable, SheetHeader, Table } from "../../components/table.style";
import SprintTable from "../sprint/sprintTable";
import { Empty, Space, Button, Dropdown } from "antd";
import { Box, Grid } from "../../components/layout.style";
import Logo from "../../assets/logo";
import { FiDownload, FiPrinter } from "react-icons/fi";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ExportInvoice = props => {
    const UserData = useContext(UserContext);
    const excluded = UserData.excluded;
    const extracost = UserData.invoice.get.extracost ? UserData.invoice.get.extracost : null;
    const printable = useRef();
    const dataTable = useRef(null);

    let total = {
        cost: 0,
        discount: 0,
        personnel: 0,
        travel: extracost?.travel === 'lumpsum' ? parseInt(extracost.travelCost) : 0,
        research: extracost?.research === 'lumpsum' ? parseInt(extracost.researchCost) : 0,
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
    
    const items = [{ key: '1', label: (<span onClick={handleDownloadPdf}>Download PDF</span>) }, { key: '2', label: (<DownloadTableExcel
        filename={`Athlon Sheet: ${UserData.invoice.get.customer.name}_${UserData.invoice.get.project.name}`}
        sheet="Invoice"
        currentTableRef={dataTable.current}
    >
       <span> Download Excel </span></DownloadTableExcel>) }];
    return <>
        <div style={{ display: 'none' }} ><SprintTable /></div>
        <SheetHeader>
            <Grid cols="auto max-content" className="sheetHeader">
                <Box></Box>
                <Box pad={['x2', 'x0']}>
                    <Space>
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
                    <h4>Athlon Sheet</h4>
                </Box>
            </Grid>
            { UserData.sheet?.get.length > 0 && <Box pad={['x3', 'x0']}>
                <FreeTable>
                    <tbody>
                        <tr>
                            <td>
                                <span>Invoice for</span>
                                <strong>{UserData.invoice.get.customer.name}</strong>
                                <span>{UserData.invoice.get.customer.contactName} ({UserData.invoice.get.customer.contactEmail})</span>
                            </td>
                            <td>
                                <span>Project Name</span>
                                <strong>{UserData.invoice.get.project.name}</strong>
                            </td>
                            <td>
                                <span>Project Start</span>
                                <strong>{dayjs(UserData.invoice.get.project.date, 'DD/MM/YYYY').format('MMM D, YYYY')}</strong>
                            </td>
                        </tr>
                    </tbody>
                </FreeTable>
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
                        <th className="alignR">Discount%</th>
                        <th className="alignR">Discount</th>
                        <th className="alignR">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        UserData.sheet.get.map((group) => group.map((elem, index) => {
                            if (elem.type === 'invoice') {
                                total.personnel += parseInt(elem.cost);
                                total.cost += parseInt(elem.total);
                                total.discount += parseInt(elem.discount);
                                total.travel += elem.travel;
                                total.research += elem.research;
                            }

                            const Row = elem.type === 'invoice' ? <tr className="invoiceRow" key={`sheet_${elem.type}_${index}`}>
                                <td>{dayjs(elem.date, 'DD/MM/YYYY').format('MMM D, YYYY')}</td>
                                <td colSpan={2}>INVOICE</td>
                                <td className="alignR">{elem.cost}</td>
                                <td className="alignR">{elem.travel}</td>
                                <td className="alignR">{elem.research}</td>
                                <td colSpan={2} className="alignR">{elem.discount ? `-` : ''}{elem.discount}</td>
                                <td className="alignR"><strong>${new Intl.NumberFormat().format(elem.total)}</strong></td>
                            </tr> : <tr key={`sheet_${elem.type}_${index}`}>
                                <td>{elem.date}</td>
                                <td>Sprint {elem.sprint}</td>
                                <td>{elem.members.length - elem.members.filter((e, i) => excluded.get[`sprint_${elem.sprint}`] && excluded.get[`sprint_${elem.sprint}`][i] && !excluded.get[`sprint_${elem.sprint}`][i].active).length}</td>
                                <td className="alignR">{elem.personnel}</td>
                                <td className="alignR">{elem.travel}</td>
                                <td className="alignR">{elem.research}</td>
                                <td className="alignR">{elem.discount}%</td>
                                <td className="alignR">{elem.discountValue ? `-` : ''}{elem.discountValue}</td>
                                <td className="alignR"><strong>${new Intl.NumberFormat().format(elem.cost)}</strong></td>
                            </tr>;
                            return Row;
                        })
                        )
                    }
                </tbody>
                <tbody className="totalBody">
                    <tr>
                        <td colSpan={8} className="alignR"><em>Total Personnel Cost</em></td>
                        <td className="alignR">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total.personnel)}</td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="alignR"><em>Travels</em></td>
                        <td className="alignR">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total.travel)}</td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="alignR"><em>Research Incentives</em></td>
                        <td className="alignR">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total.research)}</td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="alignR"><em>Discount</em></td>
                        <td className="alignR">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total.discount)}</td>
                    </tr>
                    {
                        extracost?.insurance && <>
                            <tr>
                                <td colSpan={8} className="alignR"><strong>TOTAL</strong></td>
                                <td className="alignR"><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total.cost)}</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={8} className="alignR"><em>Payment Insurance (5% of total)</em></td>
                                <td className="alignR"><em>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total.cost * 5 / 100)}</em></td>
                            </tr>
                        </>
                    }
                    <tr className="totalRow">
                        <td colSpan={8} className="alignR"><strong>NET TOTAL</strong></td>
                        <td className="alignR"><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(extracost?.insurance ? total.cost + (total.cost * 5 / 100) : total.cost)}</strong></td>
                    </tr>
                </tbody>
            </table></Table> : <Box pad={['x4']}><Empty description={<p><strong>No Data</strong><br/>Please provide complete information for invoice fields</p>}/></Box>
            }
        </Box>
    </AthlonSheet>
    </>
}
export default ExportInvoice;