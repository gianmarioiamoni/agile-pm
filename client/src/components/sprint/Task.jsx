import React from 'react';
import { Grid, Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoneIcon from '@mui/icons-material/Done';

import TaskCard from './TaskCard';

export default function Task({ task, index, handleTaskStatusChange }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do':
                return 'red';
            case 'In Progress':
                return 'orange';
            case 'Done':
                return 'green';
            default:
                return 'gray';
        }
    };

    return (
        <Draggable draggableId={task._id} index={index} key={task._id}>
            {(provided) => (
                <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" component="div">{task.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                                    <Chip label={task.status} sx={{ backgroundColor: getStatusColor(task.status), color: 'white' }} />
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={() => handleTaskStatusChange(task._id, 'To Do')}
                                        color={task.status === 'To Do' ? 'primary' : 'default'}
                                    >
                                        <ArrowUpwardIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleTaskStatusChange(task._id, 'In Progress')}
                                        color={task.status === 'In Progress' ? 'primary' : 'default'}
                                    >
                                        <ArrowForwardIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleTaskStatusChange(task._id, 'Done')}
                                        color={task.status === 'Done' ? 'primary' : 'default'}
                                    >
                                        <DoneIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Draggable>
    );
};

