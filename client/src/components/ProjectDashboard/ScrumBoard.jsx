import React from 'react';
import { Link } from 'react-router-dom';

import { Paper, Typography, Grid, Card, CardContent, CardHeader, Button, Box } from '@mui/material';

/**
 * Scrum Board component to display tasks for each sprint grouped by their status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.sprints - Array of sprint data
 * @returns {JSX.Element|null} - Rendered component
 */
export default function ScrumBoard({ sprints }) {

    // If sprints data is not available, return null
    if (!sprints) {
        return null;
    }

    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Scrum Board</Typography>
                {/* Button to navigate to Backlog page */}
                <Button component={Link} to={`/sprint-tasks-status/${sprints[0]._id}`} variant="contained" color="secondary" size="small">
                    Go to Tasks Management
                </Button>
            </Box>
            {/* Map through sprints and display tasks for each sprint */}
            {sprints.map((sprint) => (
                <div key={sprint._id} style={{ marginTop: 16 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={'fontWeightBold'}>{sprint.name}</Typography>
                    <Grid container spacing={2}>
                        {/* To Do Tasks */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" textAlign={'center'} fontWeight={'fontWeightBold'}>To Do</Typography>
                            {/* Map through items and display tasks with status 'To Do' */}
                            {sprint.items?.map((item) =>
                                item.tasks
                                    .filter((task) => task.status === 'To Do')
                                    .map((task) => (
                                        <Card
                                            key={task._id}
                                            style={{ marginBottom: 8, backgroundColor: 'red' }}>
                                            <CardHeader
                                                title={task.title}
                                                titleTypographyProps={{ variant: 'h8', gutterBottom: true, style: { fontWeight: 'bold' } }} 
                                            />
                                            <CardContent>
                                                <Typography variant="body2">{task.description}</Typography>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    Assignee: {task.assignee ? task.assignee.username : 'Unassigned'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                            )}
                        </Grid>

                        {/* In Progress Tasks */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" textAlign={'center'} fontWeight={'fontWeightBold'}>In Progress</Typography>
                            {/* Map through items and display tasks with status 'In Progress' */}
                            {sprint.items?.map((item) =>
                                item.tasks
                                    .filter((task) => task.status === 'In Progress')
                                    .map((task) => (
                                        <Card key={task._id} style={{ marginBottom: 8, backgroundColor: 'orange' }}>
                                            <CardHeader
                                                title={task.title} 
                                                titleTypographyProps={{ variant: 'h8', gutterBottom: true, style: { fontWeight: 'bold' } }}
                                                />
                                            <CardContent>
                                                <Typography variant="body2">{task.description}</Typography>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    Assignee: {task.assignee ? task.assignee.username : 'Unassigned'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                            )}
                        </Grid>

                        {/* Done Tasks */}
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" textAlign={'center'} fontWeight={'fontWeightBold'}>Done</Typography>
                            {/* Map through items and display tasks with status 'Done' */}
                            {sprint.items?.map((item) =>
                                item.tasks
                                    .filter((task) => task.status === 'Done')
                                    .map((task) => (
                                        <Card key={task._id} style={{ marginBottom: 8, backgroundColor: 'green' }}>
                                            <CardHeader
                                                title={task.title} 
                                                titleTypographyProps={{ variant: 'h8', gutterBottom: true, style: { fontWeight: 'bold' } }}
                                            />
                                            <CardContent>
                                                <Typography variant="body2">{task.description}</Typography>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    Assignee: {task.assignee ? task.assignee.username : 'Unassigned'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                            )}
                        </Grid>
                    </Grid>
                </div>
            ))}
        </Paper>
    );
};
