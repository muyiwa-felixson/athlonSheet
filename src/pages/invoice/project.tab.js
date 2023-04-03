import { Box } from "../../components/layout.style";
import { ManageProject } from "../projects";

const ProjectTab = props =>{
    return <Box pad={['x0', 'x5']}>
    <ManageProject />
    </Box>
}

export default ProjectTab;