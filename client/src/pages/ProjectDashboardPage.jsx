import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box, Tabs, Tab } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import ProjectInfo from "../components/ProjectDashboard/ProjectInfo";
import ProjectBacklog from "../components/ProjectDashboard/ProjectBacklog";
import SprintBacklog from "../components/ProjectDashboard/SprintBacklog";
import ScrumBoard from "../components/ProjectDashboard/ScrumBoard";
import BurndownChart from "../components/ProjectDashboard/BurndownChart";
import SprintVelocityChart from "../components/ProjectDashboard/SprintVelocityChart";
import ProjectProgressReport from '../components/ProjectDashboard/ProjectProgressReport';
import TeamPerformanceReport from '../components/ProjectDashboard/TeamPerformanceReport';

import { fetchProjectData } from "../services/projectDashboardServices";
import { StyledTabs, StyledTab, MetricTab, ReportTab } from "../components/CustomTabs";

import { defaultBaseColor, metricBaseColor, reportBaseColor } from '../utils/colors';

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

export default function ProjectDashboardPage() {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [indicatorColor, setIndicatorColor] = useState(defaultBaseColor);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const data = await fetchProjectDashboardData(projectId);
                setProjectData(data);
            } catch (error) {
                console.error('Failed to fetch project data:', error);
            }
        };

        fetchProjectData();
    }, [projectId]);

    const handleChange = (event, newValue) => {
        console.log('Tab value changed to:', newValue);
        setTabValue(newValue);
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

    if (!projectData) {
        console.log('Project data is not yet available');
        return <Typography>Loading...</Typography>;
    }

    const formattedBurndownData = projectData.burndownData.map(sprint => ({
        ...sprint,
        dailyPoints: sprint.dailyPoints.map(point => ({
            ...point,
            date: new Date(point.date).toISOString()
        }))
    }));

    return (
        <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <Typography variant="h4" gutterBottom marginTop={2}>Project Dashboard</Typography>
            <Grid container spacing={3} flex={2} flexDirection={'column'} justifyContent={'space-between'} alignItems={'stretch'}>
                <Grid item xs={12} md={3}>
                    <ProjectInfo project={projectData.project} />
                </Grid>
                <Grid item xs={12} md={9}>
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
                        {formattedBurndownData && <BurndownChart data={formattedBurndownData} />}
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        {projectData.sprintVelocityData && <SprintVelocityChart data={projectData.sprintVelocityData} />}
                    </TabPanel>
                    <TabPanel value={tabValue} index={5}>
                        <ProjectProgressReport data={projectData} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={6}>
                        <TeamPerformanceReport data={projectData} />
                    </TabPanel>
                </Grid>
            </Grid>
        </Container>
    );
};

function fetchProjectDashboardData(projectId) {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    return fetchProjectData(projectId);
}
