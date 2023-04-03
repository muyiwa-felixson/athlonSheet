import { Box } from "../../components/layout.style";
import { ManageDiscounts } from "../discounts";

const DiscountTab = props =>{
    return <Box pad={['x0', 'x5']}>
    <ManageDiscounts />
    </Box>
}

export default DiscountTab;