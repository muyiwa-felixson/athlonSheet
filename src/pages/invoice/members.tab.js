import { Box } from "../../components/layout.style";
import { ManageMembers } from "../members"

const MembersTab = props =>{
    return <Box pad={['x0', 'x5']}>
    <ManageMembers />
    </Box>
}

export default MembersTab;