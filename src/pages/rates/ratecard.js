import { Box, Grid } from "../../components/layout.style";
import { UserContext } from '../../App';
import { Table, Radio, Button } from 'antd';
import { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { TableInput } from "../../components/input.style";
import Theme from "../../utility/theme";
import { fetchRateData } from "../login/googlesheet";
import { sheetDataToObject } from "../../utility/util";

const RateTab = props => {
    const UserData = useContext(UserContext);
    const [businessType, setBusinessType] = useState(UserData.invoice?.get.customer ? UserData.invoice?.get.customer.type : 'enterprise');
    const previous = UserData.data?.rateCard?.get ? UserData.data.rateCard.get : [];
    const [rateChanged, setRateChanged] = useState(false);
    const [activity, setActivity] = useState(false);
    const [rate, setRate] = useState([...previous]);

    // console.log(UserData.data.rateCard.get)

    const editRateCost = (i, type, e) => {
        const value = e.target.value;
        let newRateCard = [...rate];
        newRateCard[i][type] = value;
        setRate(newRateCard);
        setRateChanged(true);
    }

    const saveCost = () => {
        setRateChanged(false);
        UserData.data.rateCard.set(rate);
        Cookies.set("sheetRates", JSON.stringify(rate), { expires: 3 });
    }


    
      // Fetch sheet members and rate cards
      const reset = () => {   
        setActivity(true);
          fetchRateData()
            .then((value) => {
                setActivity(false);
              setRate(sheetDataToObject(value));
              setRateChanged(false);
                UserData.data.rateCard.set(sheetDataToObject(value));
                Cookies.set("sheetRates", JSON.stringify(sheetDataToObject(value)), { expires: 3 });
            })
            .catch((error) => {
                console.log(error);
                setActivity(false);
            });
      };

    const cols = [
        {
            title: "Role",
            dataIndex: 'role',
            render: (v, row) => <strong>{v}</strong>
        },
        {
            title: "Company",
            dataIndex: 'group'
        },
    ]

    const business = businessType === 'enterprise' ? (
        [{
            title: "Daily rate",
            dataIndex: 'enterprise_daily',
            render: (v, row, i) => <><TableInput onChange={(e) => editRateCost(i, 'enterprise_daily', e)} value={v} /></>
        },
        {
            title: "Hourly Rate",
            dataIndex: 'enterprise_hourly',
            render: (v, row, i) => <TableInput onChange={(e) => editRateCost(i, 'enterprise_hourly', e)} value={v} />
        }]
    ) : (
        [{
            title: "Daily rate",
            dataIndex: 'sme_daily',
            render: (v, row, i) => <TableInput onChange={(e) => editRateCost(i, 'sme_daily', e)} value={v} />
        },
        {
            title: "Hourly Rate",
            dataIndex: 'sme_hourly',
            render: (v, row, i) => <TableInput onChange={(e) => editRateCost(i, 'sme_hourly', e)} value={v} />
        }]
    )
    let column = cols.concat(business);

    useEffect(() => {
        setBusinessType(UserData.invoice.get.customer?.type)
    }, [UserData.invoice]);
    return <>
        <Box pad={['x2', 'x5']}>
            <Grid cols="auto max-content max-content" gap={Theme.dimensions.x2}>
                <h4>Rate Card</h4>
                <Button size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => reset()} loading={activity}>Reset Rates</Button>
                <Button disabled={!rateChanged} type="primary" size="large" style={{ borderRadius: Theme.primary.radius }} onClick={() => saveCost()}>Apply Updates</Button>
            </Grid>
            <Box pad={['x1']} />
            <Box pad={['x0', 'x0', 'x3']}>
                <Radio.Group value={businessType} onChange={(e) => setBusinessType(e.target.value)} type="primary">
                    <Radio.Button value='enterprise'>Enterprise</Radio.Button>
                    <Radio.Button value='sme'>Small business</Radio.Button>
                </Radio.Group>
            </Box>
            {UserData.data.rateCard.get.length >= 1 &&
                <Table columns={column} dataSource={rate} size="small" bordered pagination={false} rowKey={(e) => e.role} />
            }
        </Box>
    </>
}

export default RateTab;