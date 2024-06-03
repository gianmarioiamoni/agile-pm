import React from 'react';
import { Paper, Typography, Grid, Card, CardContent, CardHeader, Chip } from '@mui/material';

export default function ScrumBoard({ sprints }) {

    if (!sprints) {
        return null;
    }



    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">Scrum Board</Typography>
            {sprints.map((sprint) => (
                <div key={sprint._id} style={{ marginTop: 16 }}>
                    <Typography variant="subtitle1">{sprint.name}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2">To Do</Typography>
                            {sprint.items?.map((item) =>
                                item.tasks
                                    .filter((task) => task.status === 'To Do')
                                    .map((task) => (
                                        <Card key={task._id} style={{ marginBottom: 8 }}>
                                            <CardHeader title={task.title} />
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
                        <Grid item xs={4}>
                            <Typography variant="subtitle2">In Progress</Typography>
                            {sprint.items?.map((item) =>
                                item.tasks
                                    .filter((task) => task.status === 'In Progress')
                                    .map((task) => (
                                        <Card key={task._id} style={{ marginBottom: 8 }}>
                                            <CardHeader title={task.title} />
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
                        <Grid item xs={4}>
                            <Typography variant="subtitle2">Done</Typography>
                            {sprint.items?.map((item) =>
                                item.tasks
                                    .filter((task) => task.status === 'Done')
                                    .map((task) => (
                                        <Card key={task._id} style={{ marginBottom: 8 }}>
                                            <CardHeader title={task.title} />
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
