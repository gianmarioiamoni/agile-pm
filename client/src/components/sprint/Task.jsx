import React from 'react';
import { Grid, Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/system';

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

    const getChipPosition = (status) => {
        switch (status) {
            case 'To Do':
                return 'flex-start';
            case 'In Progress':
                return 'center';
            case 'Done':
                return 'flex-end';
            default:
                return 'flex-start';
        }
    };

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        margin: theme.spacing(0.5),
        color: 'white',
        '&.to-do': {
            backgroundColor: 'red',
            '&:hover': {
                backgroundColor: 'darkred',
            },
        },
        '&.in-progress': {
            backgroundColor: 'orange',
            '&:hover': {
                backgroundColor: 'darkorange',
            },
        },
        '&.done': {
            backgroundColor: 'green',
            '&:hover': {
                backgroundColor: 'darkgreen',
            },
        },
    }));

    return (
        <Draggable draggableId={task._id} index={index} key={task._id}>
            {(provided) => (
                <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                {/* Task information */}
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="h6" component="div">{task.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                                    <Box display="flex" justifyContent={getChipPosition(task.status)}>
                                        <Chip label={task.status} sx={{ backgroundColor: getStatusColor(task.status), color: 'white' }} />
                                    </Box>
                                </Box>
                                {/* Status change buttons */}
                                <Box display="flex" alignItems="center">
                                    <StyledIconButton
                                        onClick={() => handleTaskStatusChange(task._id, 'To Do')}
                                        className="to-do"
                                    >
                                        <ArrowUpwardIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        onClick={() => handleTaskStatusChange(task._id, 'In Progress')}
                                        className="in-progress"
                                    >
                                        <ArrowForwardIcon />
                                    </StyledIconButton>
                                    <StyledIconButton
                                        onClick={() => handleTaskStatusChange(task._id, 'Done')}
                                        className="done"
                                    >
                                        <DoneIcon />
                                    </StyledIconButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Draggable>
    );
}
