// src/components/ProjectDashboard/ProjectProgressReport.js
import React from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';

/**
 * Component to display project progress report
 * @param {Object} props - Component props
 * @param {Object} props.data - Project data
 * @param {Object} props.data.project - Project object
 * @param {Array} props.data.sprints - Array of sprint objects
 * @param {Array} props.data.backlog - Array of backlog item objects
 * @returns {ReactElement} - Rendered component
 */
export default function ProjectProgressReport({ data }) {
    const { project, sprints, backlog } = data;

    // Calculate completed sprints and total tasks
    const completedSprints = sprints.filter(sprint => sprint.completed);
    const totalTasks = backlog.length;

    // Calculate completed tasks and progress percentage
    const completedTasks = backlog.filter(task => task.status === 'completed').length;
    const progressPercentage = (completedTasks / totalTasks) * 100;

    return (
        <Box sx={{ mt: 2 }}>
            {/* Project Progress Report heading */}
            <Typography variant="h6" gutterBottom>Project Progress Report</Typography>
            <Grid container spacing={2}>
                {/* Project Name card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Project Name</Typography>
                            <Typography variant="h6">{project.name}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Sprints card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Total Sprints</Typography>
                            <Typography variant="h6">{sprints.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Completed Sprints card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Completed Sprints</Typography>
                            <Typography variant="h6">{completedSprints.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Total Tasks card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Total Tasks</Typography>
                            <Typography variant="h6">{totalTasks}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Completed Tasks card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Completed Tasks</Typography>
                            <Typography variant="h6">{completedTasks}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Progress card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1">Progress</Typography>
                            {/* Progress bar */}
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={progressPercentage}
                                    size={60}
                                    thickness={4}
                                />
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="textSecondary"
                                    >{`${Math.round(progressPercentage)}%`}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
