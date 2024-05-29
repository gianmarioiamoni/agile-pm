import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { Typography, Paper, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import { deleteTask, updateTask } from '../../services/taskServices';

import NewTaskForm from './NewTaskForm';

export default function BacklogItem({
    item,
    handleTaskStatusChange,
    handleNewTaskChange,
    handleAddTask,
    handleDeleteTask,
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

    const handleEditTask = (taskId, data) => {
        // Handle edit task logic
        console.log('Edit task:', taskId, 'data:', data);

    };
    const handleAssignee = (taskId, data) => {
        // Handle assignee logic
        console.log('Assignee:', taskId, 'data:', data);
        // handleAssigneeChange(taskId, data);
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
                                        <Grid container spacing={8}>
                                            {/* <Grid item xs={8} sm={9} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}> */}
                                            <Grid item xs={8} sm={9} >
                                                {/* Task Information + editing / assign constrols */}
                                                <Grid container spacing={2}>
                                                    {/* Task Information */}
                                                    <Grid item xs={8} sm={6}>

                                                        <div>
                                                            <Typography variant="body2" gutterBottom>{task.title}</Typography>
                                                            <Typography variant="caption" display="block" gutterBottom>{task.description}</Typography>
                                                            <Typography variant="caption" display="block" gutterBottom color={task && task.assignee ? 'primary' : 'red'}>assignee: {task && task.assignee ? task.assignee.username : 'UNASSIGNED'} </Typography>
                                                        </div>

                                                    </Grid>
                                                    {/* Assign / edit controls */}
                                                    <Grid item xs={4} sm={6} >
                                                        {/* Task edit, delete and assignment controls */}
                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                            <Tooltip title="Responsible assignment" arrow>
                                                                <div>
                                                                    <IconButton onClick={() => handleAssignee(task._id, task.assignee)}>
                                                                        <AssignmentIndIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                            <Tooltip title="Delete task" arrow>
                                                                <div>
                                                                    <IconButton onClick={() => handleDeleteTask(task._id)}>
                                                                        <DeleteIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                            <Tooltip title="Edit task" arrow>
                                                                <div>
                                                                    <IconButton onClick={() => handleEditTask(task._id)}>
                                                                        <EditIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {/* Task Status controls */}
                                            <Grid item xs={4} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                                <Grid container spacing={1}>
                                                    {['To Do', 'In Progress', 'Done'].map((status) => (
                                                        <Grid item key={status}>
                                                            <Chip
                                                                label={status}
                                                                sx={{ backgroundColor: status === task.status ? getTaskStatusColor(task.status) : 'default', color: status === task.status ? 'white' : 'default' }}
                                                                onClick={() => handleTaskStatusChange(task._id, status)}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            
                                        </Grid>    
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

