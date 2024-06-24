import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box, Tabs, Tab } from '@mui/material';

import ProjectInfo from "../components/ProjectDashboard/ProjectInfo";
import ProjectBacklog from "../components/ProjectDashboard/ProjectBacklog";
import SprintBacklog from "../components/ProjectDashboard/SprintBacklog";
import ScrumBoard from "../components/ProjectDashboard/ScrumBoard";
import BurndownChart from "../components/ProjectDashboard/BurndownChart";
import SprintVelocityChart from "../components/ProjectDashboard/SprintVelocityChart";
import ProjectProgressReport from "../components/ProjectDashboard/ProjectProgressReport";
import TeamPerformanceReport from "../components/ProjectDashboard/TeamPerformanceReport";
import Header from "../components/Header";

import { fetchProjectData } from "../services/projectDashboardServices";
import { StyledTab, MetricTab, ReportTab } from "../components/CustomTabs";

import { defaultBaseColor, metricBaseColor, reportBaseColor } from '../utils/colors';

/**
 * The ProjectDashboardPage component renders the project dashboard page.
 * It fetches project data and renders different tabs for different metrics and reports.
 */
export default function ProjectDashboardPage() {
    // Get the project ID from the URL parameters
    const { projectId } = useParams();
    // State to store the project data
    const [projectData, setProjectData] = useState(null);
    // State to store the active tab value
    const [tabValue, setTabValue] = useState(0);
    // State to store the color of the tab indicator
    const [indicatorColor, setIndicatorColor] = useState(defaultBaseColor);

    // Fetch project data when the project ID changes
    useEffect(() => {
        const fetchProjectDashboardData = async () => {
            try {
                const data = await fetchProjectData(projectId);
                setProjectData(data);
            } catch (error) {
                console.error('Failed to fetch project data:', error);
            }
        };

        fetchProjectDashboardData();
    }, [projectId]);

    /**
     * Handle tab change event. Update the active tab value and the indicator color.
     * @param {Object} event - The event object.
     * @param {number} newValue - The new tab value.
     */
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        // Update the indicator color based on the tab value
        if (newValue === 3) {
            setIndicatorColor(metricBaseColor);
        } else if (newValue === 4) {
            setIndicatorColor(metricBaseColor);
        } else if (newValue === 5 || newValue === 6) {
            setIndicatorColor(reportBaseColor);
        } else {
            setIndicatorColor(defaultBaseColor);
        }
    };

    // Render the project dashboard page
    if (!projectData) {
        console.log('Project data is not yet available');
        return <Typography>Loading...</Typography>;
    }

    console.log("projectData: ", projectData);
    console.log("projectData.burndownData: ", projectData.burndownData);
    // Format the burndown data for the chart component
    const formattedBurndownData = projectData.burndownData.sprints.map(sprint => ({
        ...sprint,
        dailyPoints: sprint.sprintDailyPoints.map(point => ({
            ...point,
            date: new Date(point.date).toISOString()
        }))
    }));

    // Format the project progress data for the chart component
    const formattedProjectData = projectData.burndownData.project.map(point => ({
        ...point,
        date: new Date(point.date).toISOString()
    }));

    return (
        <>
            <Header isShowHome={true} isShowDashboard={true} isShowProfile={true} />
            {/* Project dashboard container */}
            <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                <Typography variant="h4" gutterBottom marginTop={2}>{projectData.project.name} - Dashboard</Typography>
                {/* Render the tabs and tab panels */}
                <Grid container spacing={3} flex={2} flexDirection={'column'} justifyContent={'space-between'} alignItems={'stretch'}>
                    <Grid item xs={12}>
                        <ProjectInfo project={projectData} />
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            aria-label="project dashboard tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: indicatorColor,
                                },
                                '& .MuiTabs-scrollButtons': {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                            }}
                        >
                            <StyledTab label="Backlog" />
                            <StyledTab label="Sprint Backlog" />
                            <StyledTab label="Scrum Board" />
                            <MetricTab label="Burndown Chart" />
                            <MetricTab label="Sprint Velocity" />
                            <ReportTab label="Project Progress Report" />
                            <ReportTab label="Team Performance Report" />
                        </Tabs>
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
                            {formattedBurndownData && formattedProjectData && (
                                <BurndownChart
                                    sprintData={formattedBurndownData}
                                    projectData={formattedProjectData}
                                />
                            )}
                        </TabPanel>
                        <TabPanel value={tabValue} index={4}>
                            {projectData.sprintVelocityData && <SprintVelocityChart data={projectData.sprintVelocityData} />}
                        </TabPanel>
                        <TabPanel value={tabValue} index={5}>
                            <ProjectProgressReport projectData={projectData} />
                        </TabPanel>
                        <TabPanel value={tabValue} index={6}>
                            <TeamPerformanceReport projectData={projectData} />
                        </TabPanel>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

// UTILITY FUNCTIONS

// Fetch project data
function fetchProjectDashboardData(projectId) {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    return fetchProjectData(projectId);
}

// Tab panel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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
