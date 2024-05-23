import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Grid, Typography, Button } from '@mui/material';

import { getTasksBySprintId, updateTaskStatus } from "../services/taskServices";

export default function SprintTaskStatusPage() {
    const { sprintId } = useParams();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const sprintTasks = await getTasksBySprintId(sprintId);
                setTasks(sprintTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, [sprintId]);

    const handleUpdateTaskStatus = async (taskId, status) => {
        try {
            await updateTaskStatus(taskId, status);
            setTasks(tasks.map(task => (task._id === taskId ? { ...task, status } : task)));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const renderTasks = (status, color) => (
        <div>
            <Typography variant="h6" style={{ color, textAlign: 'center' }}>{status}</Typography>
            {tasks.filter(task => task.status === status).map(task => (
                <Paper key={task._id} style={{ padding: '10px', margin: '10px 0', backgroundColor: color }}>
                    <Typography variant="body1" style={{ color: '#fff' }}>{task.title}</Typography>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#fff', color, marginTop: '10px' }}
                        onClick={() => handleUpdateTaskStatus(task._id, getNextStatus(status))}
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
            <Grid container spacing={3} marginTop={4} alignContent={'center'}>
                <Grid item xs={4}>
                    {renderTasks('To Do', 'red')}
                </Grid>
                <Grid item xs={4}>
                    {renderTasks('In Progress', 'orange')}
                </Grid>
                <Grid item xs={4}>
                    {renderTasks('Done', 'green')}
                </Grid>
            </Grid>
        </div>
    );
}
