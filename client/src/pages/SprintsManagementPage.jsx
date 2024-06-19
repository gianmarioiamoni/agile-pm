import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import Header from "../components/Header";
import AddSprint from "../components/sprint/AddSprint";
import SprintList from "../components/sprint/SprintList";

import { getSprintsByProjectId } from "../services/sprintServices";
import { getBacklogItems } from "../services/backlogServices";

/**
 * Page for managing sprints for a project
 *
 * This page allows the user to add new sprints and view all sprints for a project.
 *
 * @param {Object} props - Props passed to the component
 * @param {Function} props.getProjectName - Function to get the name of the project
 * @param {boolean} [props.canCreateSprint=true] - Flag indicating if the user can create sprints
 * @param {boolean} [props.canEditSprint=true] - Flag indicating if the user can edit sprints
 * @param {boolean} [props.canDeleteSprint=true] - Flag indicating if the user can delete sprints
 * @returns {ReactElement} The SprintsManagementPage component
 */
export default function SprintsManagementPage({
    getProjectName,
    canCreateSprint = true,
    canEditSprint = true,
    canDeleteSprint = true
}) {

    const { projectId } = useParams();

    // State to hold the sprints and backlog items
    const [sprints, setSprints] = useState([]);
    const [backlogItems, setBacklogItems] = useState([]);

    // Fetch sprints and backlog items when the projectId changes
    useEffect(() => {
        // Fetch sprints
        const fetchSprints = async () => {
            try {
                const sprintsData = await getSprintsByProjectId(projectId);
                console.log('Sprints:', sprintsData.sprints);
                setSprints(sprintsData.sprints);
            } catch (error) {
                console.error('SprintsManagementPage: fetchSprints: Error fetching sprints:', error);
            }
        };

        // Fetch backlog items
        const fetchBacklogItems = async () => {
            try {
                const items = await getBacklogItems(projectId);
                console.log('Backlog items:', items);
                setBacklogItems(items.filter(item => !item.sprint)); // filter not assigned items
            } catch (error) {
                console.error('SprintsManagementPage: fetchBacklogItems: Error fetching backlog items:', error);
            }
        };

        fetchSprints();
        fetchBacklogItems();
    }, [projectId]);

    // Render the page
    return (
        <>
            {/* Header */}
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} isShowBack={true}/>

            {/* Container */}
            <Container style={{ marginTop: 20 }}>
                {/* Page title */}
                <Typography variant="h4" gutterBottom>
                    Sprints Management for Project {getProjectName(projectId)}
                </Typography>

                {/* Grid layout */}
                <Grid container spacing={2}>
                    {/* Add sprint section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                            {/* Add sprint component */}
                            <AddSprint
                                projectId={projectId}
                                sprints={sprints}
                                setSprints={setSprints}
                                canCreateSprint={canCreateSprint}
                                backlogItems={backlogItems}
                            />
                        </Box>
                    </Grid>

                    {/* Sprint list section */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2, marginLeft: 8 }}>
                            {/* Sprint list component */}
                            <SprintList
                                projectId={projectId}
                                sprints={sprints}
                                setSprints={setSprints}
                                canEditSprint={canEditSprint}
                                canDeleteSprint={canDeleteSprint}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
