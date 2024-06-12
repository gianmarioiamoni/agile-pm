import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Component to display team performance report.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.projectData - Project data
 * @param {Array} props.projectData.assignments - Assignments data
 * @returns {JSX.Element} - Rendered component
 */
export default function TeamPerformanceReport({ projectData }) {
    // State to hold team members data
    const [data, setData] = useState({ teamMembers: projectData.assignments || [] });

    // Update state when project data changes
    useEffect(() => {
        setData({ teamMembers: projectData.assignments || [] });
    }, [projectData]);

    // Destructure team members data from state
    const { teamMembers = [] } = data;

    // Calculate team performance summary

    // Calculate total completed tasks
    const totalCompletedTasks = teamMembers.reduce((total, member) => total + (member.completedTasks || 0), 0);

    // Calculate total pending tasks
    const totalPendingTasks = teamMembers.reduce((total, member) => total + (member.pendingTasks || 0), 0);

    // Calculate average performance
    const averagePerformance = teamMembers.length > 0
        ? teamMembers.reduce((total, member) => total + (member.performance || 0), 0) / teamMembers.length
        : 0;

    // Prepare data for chart
    const chartData = {
        labels: ['Completed Tasks', 'Pending Tasks'],
        datasets: [
            {
                label: 'Tasks',
                data: [totalCompletedTasks, totalPendingTasks],
                backgroundColor: ['#4caf50', '#ff9800'],
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Box sx={{ mt: 2 }}>
            {/* Team Performance Report header */}
            <Typography variant="h6" gutterBottom>Team Performance Report</Typography>

            {/* Team Performance Summary card with chart */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="subtitle1">Team Summary</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <List>
                                {/* Total completed tasks */}
                                <ListItem>
                                    <ListItemText primary="Total Completed Tasks" secondary={totalCompletedTasks} />
                                </ListItem>
                                {/* Total pending tasks */}
                                <ListItem>
                                    <ListItemText primary="Total Pending Tasks" secondary={totalPendingTasks} />
                                </ListItem>
                                {/* Average performance */}
                                <ListItem>
                                    <ListItemText primary="Average Performance" secondary={`${averagePerformance.toFixed(2)}%`} />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ height: 200 }}>
                                {/* Bar chart to display tasks data */}
                                <Bar data={chartData} options={chartOptions} />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* List of team members performance */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', overflowX: 'auto' }}>
                <Grid container spacing={2} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'nowrap' }}>
                    {/* Render team member cards */}
                    {teamMembers.map((member, index) => {
                        const { completedTasks, pendingTasks, performance } = member || {};
                        const name = member?.userId?.username;
                        const role = member?.roleId?.roleDescription;

                        // Skip rendering if required data is missing
                        if (!name || !role || completedTasks === undefined || pendingTasks === undefined || performance === undefined) {
                            return null;
                        }

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ flex: { xs: '1 0 auto', md: '0 0 auto' } }}>
                                <Card>
                                    <CardContent>
                                        <List>
                                            {/* Team member name and role */}
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>{name.charAt(0)}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={name} secondary={role} />
                                            </ListItem>
                                            {/* Completed tasks */}
                                            <ListItem>
                                                <ListItemText primary="Completed Tasks" secondary={completedTasks} />
                                            </ListItem>
                                            {/* Pending tasks */}
                                            <ListItem>
                                                <ListItemText primary="Pending Tasks" secondary={pendingTasks} />
                                            </ListItem>
                                            {/* Performance */}
                                            <ListItem>
                                                <ListItemText primary="Performance" secondary={`${performance}%`} />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}

