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
 * @param {string} props.projectId - The ID of the project for which the sprints are being managed
 * @returns {ReactElement} The SprintsManagementPage component
 */
export default function SprintsManagementPage({ getProjectName, canCreateSprint = true, canEditSprint = true, canDeleteSprint = true }) {
    const { projectId } = useParams();

    const [sprints, setSprints] = useState([]);
    const [backlogItems, setBacklogItems] = useState([]);

    useEffect(() => {
        const fetchSprints = async () => {
            try {
                const sprintsData = await getSprintsByProjectId(projectId);
                setSprints(sprintsData);
            } catch (error) {
                console.error('SprintsManagementPage: fetchSprints: Error fetching sprints:', error);
            }
        };

        const fetchBacklogItems = async () => {
            try {
                const items = await getBacklogItems(projectId);
                setBacklogItems(items.filter(item => !item.sprint)); // filter not assigned items only
            } catch (error) {
                console.error('Error fetching backlog items:', error);
            }
        };

        fetchSprints();
        fetchBacklogItems();
    }, [projectId]);

    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} />

            <Container style={{ marginTop: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Sprints Management for Project {getProjectName(projectId)}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                            <AddSprint projectId={projectId} sprints={sprints} setSprints={setSprints} canCreateSprint={canCreateSprint} backlogItems={backlogItems} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2, marginLeft: 8 }}>
                            <SprintList
                                projectId={projectId}
                                sprints={sprints}
                                setSprints={setSprints}
                                canEditSprint={canEditSprint}
                                canDeleteSprint={canDeleteSprint} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
