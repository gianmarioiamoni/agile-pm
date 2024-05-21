import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

import { useParams } from 'react-router-dom';

import Header from "../components/Header";
import AddSprint from "../components/sprint/AddSprint";
import SprintList from "../components/sprint/SprintList";

import { getSprintsByProjectId } from "../services/sprintServices";


/**
 * Page for managing sprints for a project
 * 
 * This page allows the user to add new sprints and view all sprints for a project.
 * 
 * @param {Object} props - Props passed to the component
 * @param {string} props.projectId - The ID of the project for which the sprints are being managed
 * @returns {ReactElement} The SprintsManagementPage component
 */
export default function SprintsManagementPage({getProjectName, canCreateSprint = true, canEditSprint = true, canDeleteSprint = true}) {

    const { projectId } = useParams();

    /**
     * The sprints for the project
     */
    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        /**
         * Fetchs the sprints for the given project from the server.
         * The response is then set as the state of the sprints.
         */
        const fetchSprints = async () => {
            try {
                // const response = await axios.get(`/server/sprints/${projectId}`);
                const sprintsData = await getSprintsByProjectId(projectId);
                setSprints(sprintsData);
            } catch (error) {
                console.error('Error fetching sprints:', error);
            }
        };

        // Fetch sprints only if they haven't already been fetched
        if (!sprints || sprints.length === 0) {
            console.log("fetching sprints");
            fetchSprints();
        }

    }, [projectId]);

    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} />

            <Container style={{ marginTop: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Sprints Management for Project {getProjectName(projectId)}
                </Typography>
                {/* The grid containing the AddSprint and SprintList components */}
                <Grid container spacing={2}>
                    {/**
                 * The component for adding new sprints
                 * 
                 * @param {string} projectId - The ID of the project for which the sprint is being added
                 * @param {Array} sprints - The current list of sprints
                 * @param {Function} setSprints - The function to update the sprints
                 */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                            <AddSprint projectId={projectId} sprints={sprints} setSprints={setSprints} canCreateSprint={canCreateSprint} />
                        </Box>
                    </Grid>
                    {/**
                 * The component for viewing the list of sprints
                 * 
                 * @param {string} projectId - The ID of the project for which the sprints are being viewed
                 * @param {Array} sprints - The current list of sprints
                 * @param {Function} setSprints - The function to update the sprints
                 */}
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
