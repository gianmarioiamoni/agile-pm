import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Grid, Typography, Button } from '@mui/material';
import axios from 'axios';

export default function SprintTaskStatusPage() {
    const { sprintId } = useParams();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/server/tasks/sprint/${sprintId}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, [sprintId]);

    const updateTaskStatus = async (taskId, status) => {
        try {
            await axios.post('/server/tasks/updateStatus', { taskId, status });
            setTasks(tasks.map(task => (task._id === taskId ? { ...task, status } : task)));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const renderTasks = (status) => (
        <div>
            <Typography variant="h6">{status}</Typography>
            {tasks.filter(task => task.status === status).map(task => (
                <Paper key={task._id} style={{ padding: '10px', margin: '10px 0' }}>
                    <Typography variant="body1">{task.title}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => updateTaskStatus(task._id, getNextStatus(status))}
                    >
                        {getNextStatusLabel(status)}
                    </Button>
                </Paper>
            ))}
        </div>
    );

    const getNextStatus = (status) => {
        switch (status) {
            case 'To Do': return 'In Progress';
            case 'In Progress': return 'Done';
            default: return 'To Do';
        }
    };

    const getNextStatusLabel = (status) => {
        switch (status) {
            case 'To Do': return 'Start';
            case 'In Progress': return 'Complete';
            default: return 'Reset';
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4">Sprint Task Status</Typography>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    {renderTasks('To Do')}
                </Grid>
                <Grid item xs={4}>
                    {renderTasks('In Progress')}
                </Grid>
                <Grid item xs={4}>
                    {renderTasks('Done')}
                </Grid>
            </Grid>
        </div>
    );
}
