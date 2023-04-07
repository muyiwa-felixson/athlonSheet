import { Box } from "../../components/layout.style";
import { UserContext } from '../../App';
import { Table, Radio, Modal } from 'antd';
import { useState, useContext, useEffect } from "react";
import { UpdateRate } from "./update.rate";
import Theme from "../../utility/theme";
import { TableInput } from "../../components/input.style";

const RateTab = props =>{
    const UserData = useContext(UserContext);
    const [businessType, setBusinessType] = useState(UserData.invoice?.get.customer ? UserData.invoice?.get.customer.type : 'enterprise');
    const [modal, setModal] = useState(false);
    const [editState, setEditState] = useState(null);

    const popRate = (index, element, value) => {
        setEditState({index: index, element: element, val: value })
        setModal(true);
    }
    const closeRate = () => {
        setEditState(null)
        setModal(false);
    }
const cols =[
    {
        title: "Role",
        dataIndex: 'role',
        render: (v,row) => <strong>{v}</strong>
    },
    {
        title: "Company",
        dataIndex: 'group'
    },
]

const business =  businessType === 'enterprise' ? (
    [{
        title: "Daily rate",
        dataIndex: 'enterprise_daily',
        render: (v,row,i) => <TableInput active={i === editState?.index && 'enterprise_daily' === editState?.element} onDoubleClick={()=> popRate(i, 'enterprise_daily', v)}>{v}</TableInput>
    },
    {
        title: "Hourly Rate",
        dataIndex: 'enterprise_hourly',
        render: (v,row,i) => <TableInput active={i === editState?.index && 'enterprise_hourly' === editState?.element} onDoubleClick={()=> popRate(i, 'enterprise_hourly', v)}>{v}</TableInput>
    }]
) : (
    [{
        title: "Daily rate",
        dataIndex: 'sme_daily',
        render: (v,row,i) => <TableInput active={i === editState?.index && 'sme_daily' === editState?.element} onDoubleClick={()=> popRate(i, 'sme_daily', v)}>{v}</TableInput>
    },
    {
        title: "Hourly Rate",
        dataIndex: 'sme_hourly',
        render: (v,row,i) => <TableInput active={i === editState?.index && 'sme_hourly' === editState?.element} onDoubleClick={()=> popRate(i, 'sme_hourly', v)}>{v}</TableInput>
    } ] 
)
let column = cols.concat(business);
useEffect(() => {
    setBusinessType(UserData.invoice.get.customer?.type)
}, [UserData.invoice]);

    return <>
    <Box pad={['x2', 'x5']}>
        {/* <h4>Rate Card</h4>
        <Box pad={['x1']} /> */}
        <Box pad={['x0', 'x0', 'x3']}>
        <Radio.Group value={businessType} onChange={(e)=> setBusinessType(e.target.value)} type="primary">
            <Radio.Button value='enterprise'>Enterprise</Radio.Button>
            <Radio.Button value='sme'>Small business</Radio.Button>
        </Radio.Group>
        </Box>
       { UserData.data.rateCard.get.length >= 1 &&
        <Table columns={column} dataSource={UserData.data.rateCard.get} size="small" bordered style={{maxWidth: '1000px'}} pagination={false} rowKey={(e)=> e.role} shouldCellUpdate />
       }
       <Modal title={null} open={modal} footer={null} closable={false} destroyOnClose={true} bodyStyle={{padding: Theme.dimensions.x1}} width={400}>
            { modal && <UpdateRate {...editState} closeModal={closeRate} /> }
       </Modal>
    </Box>
    </>
}

export default RateTab;