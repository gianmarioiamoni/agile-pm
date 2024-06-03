import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container, Typography, Grid } from '@mui/material';

import ProjectInfo from "../components/ProjectDashboard/ProjectInfo";
import ProjectBacklog from "../components/ProjectDashboard/ProjectBacklog";
import SprintBacklog from "../components/ProjectDashboard/SprintBacklog";
import ScrumBoard from "../components/ProjectDashboard/ScrumBoard";

import { fetchProjectData } from "../services/projectDashboardServices";

export default function ProjectDashboardPage() {

    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const getProjectData = async () => {
            try {
                const data = await fetchProjectData(projectId);
                console.log("getProjectData() - data: ", data);
                setProjectData(data);
            } catch (error) {
                console.error('Failed to fetch project data:', error);
            }
        };

        getProjectData();
    }, [projectId]);

    if (!projectData) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Project Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ProjectInfo project={projectData.project} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ProjectBacklog backlog={projectData.backlog} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <SprintBacklog sprints={projectData.sprints} />
                </Grid>
                <Grid item xs={12}>
                    <ScrumBoard sprints={projectData.sprints} />
                </Grid>
            </Grid>
        </Container>
    );
};