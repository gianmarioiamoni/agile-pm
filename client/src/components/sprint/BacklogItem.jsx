import React from 'react';
import { Typography, Paper, Chip, Grid } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import NewTaskForm from './NewTaskForm';

export default function BacklogItem({
    item,
    handleTaskStatusChange,
    handleNewTaskChange,
    handleAddTask,
    newTask,
    isAddTaskDisabled,
    assignments,
    handleAssigneeChange }) {
       
    const statusColors = {
        'To Do': 'gray',
        'In Progress': 'blue',
        'Done': 'green'
    };

    const getTaskStatusColor = (status) => {
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
        <Paper elevation={3} style={{ padding: 16, marginBottom: 16, position: 'relative' }}>
            <Typography variant="h6" gutterBottom>{item.title}</Typography>
            <Typography variant="body1">{item.description}</Typography>
            <Typography
                variant="caption"
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: statusColors[item.status]
                }}
            >
                {item.status}
            </Typography>
            <Droppable droppableId={item._id}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {item.tasks.map((task, index) => (
                            
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ padding: 16, marginBottom: 8, ...provided.draggableProps.style }}
                                    >
                                        <Grid container spacing={1}>
                                            <Grid item xs={8}>
                                                {/* Task Information */}
                                                <div>
                                                    <Typography variant="body2" gutterBottom>{task.title}</Typography>
                                                    <Typography variant="caption" display="block" gutterBottom>{task.description}</Typography>
                                                    <Typography variant="caption" display="block" gutterBottom color={task && task.assignee ? 'primary' : 'red'}>assignee: {task && task.assignee ? task.assignee.username : 'UNASSIGNED'} </Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4}>
                                                {/* Task Status controls */}
                                                <Grid container spacing={1}>
                                                    {['To Do', 'In Progress', 'Done'].map((status) => (
                                                        <Grid item key={status}>
                                                            <Chip
                                                                label={status}
                                                                // sx={status === task.status ? { backgroundColor: getTaskStatusColor(task.status), color: 'white' } : 'default'}
                                                                sx={{ backgroundColor: status === task.status ? getTaskStatusColor(task.status) : 'default', color: status === task.status ? 'white' : 'default' }}
                                                                onClick={() => handleTaskStatusChange(task._id, status)}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                            
                                        </Grid>
                                            
                                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            
                                            
                                        </div> */}
                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <NewTaskForm
                backlogItemId={item._id}
                handleNewTaskChange={handleNewTaskChange}
                handleAddTask={handleAddTask}
                newTask={newTask}
                isAddTaskDisabled={isAddTaskDisabled}
                assignments={assignments}
                handleAssigneeChange={(e) => handleAssigneeChange(e)}
            />
        </Paper>
    )
}

