import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box } from '@mui/material';

import ProjectInfo from "../components/ProjectDashboard/ProjectInfo";
import ProjectBacklog from "../components/ProjectDashboard/ProjectBacklog";
import SprintBacklog from "../components/ProjectDashboard/SprintBacklog";
import ScrumBoard from "../components/ProjectDashboard/ScrumBoard";
import BurndownChart from "../components/ProjectDashboard/BurndownChart";
import SprintVelocityChart from "../components/ProjectDashboard/SprintVelocityChart";

import { fetchProjectData } from "../services/projectDashboardServices";
import { StyledTabs, StyledTab, BurndownTab, SprintVelocityTab } from "../components/CustomTabs";

import { burndownBaseColor, sprintVelocityBaseColor, defaultBaseColor } from '../utils/colors';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function ProjectDashboardPage() {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [indicatorColor, setIndicatorColor] = useState(defaultBaseColor); // Default color

    useEffect(() => {
        const getProjectData = async () => {
            try {
                const data = await fetchProjectData(projectId);
                setProjectData(data);
            } catch (error) {
                console.error('Failed to fetch project data:', error);
            }
        };

        getProjectData();
    }, [projectId]);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        // Set the indicator color based on the selected tab
        if (newValue === 3) {
            setIndicatorColor(burndownBaseColor);
        } else if (newValue === 4) {
            setIndicatorColor(sprintVelocityBaseColor);
        } else {
            setIndicatorColor(defaultBaseColor);
        }
    };

    if (!projectData) {
        return <Typography>Loading...</Typography>;
    }

    const formattedBurndownData = projectData.burndownData.map(sprint => ({
        ...sprint,
        dailyPoints: sprint.dailyPoints.map(point => ({
            ...point,
            date: new Date(point.date).toISOString() // Ensure date is in correct format
        }))
    }));

    const sprintVelocityData = projectData.sprints.map(sprint => ({
        sprint: sprint.name,
        velocity: sprint.completedPoints
    }));

    return (
        <Container>
            <Typography variant="h4" gutterBottom marginTop={2}>Project Dashboard</Typography>
            <Grid container spacing={3} flex={2} flexDirection={'column'} justifyContent={'space-between'} alignItems={'stretch'}>
                {/* Project information */}
                <Grid item xs={12} md={3}>
                    <ProjectInfo project={projectData.project} />
                </Grid>
                {/* Tabs for Backlog, Sprint Backlog, Scrum Board, Burndown Chart, and Sprint Velocity */}
                <Grid item xs={12} md={9}>
                    <StyledTabs
                        value={tabValue}
                        onChange={handleChange}
                        aria-label="project dashboard tabs"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: indicatorColor,
                            },
                        }}
                    >
                        <StyledTab label="Backlog" />
                        <StyledTab label="Sprint Backlog" />
                        <StyledTab label="Scrum Board" />
                        <BurndownTab label="Burndown Chart" />
                        <SprintVelocityTab label="Sprint Velocity" />
                    </StyledTabs>
                    <TabPanel value={tabValue} index={0}>
                        <ProjectBacklog backlog={projectData.backlog} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <SprintBacklog sprints={projectData.sprints} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <ScrumBoard sprints={projectData.sprints} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <BurndownChart data={formattedBurndownData} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        <SprintVelocityChart data={sprintVelocityData} />
                    </TabPanel>
                </Grid>
            </Grid>
        </Container>
    );
};
