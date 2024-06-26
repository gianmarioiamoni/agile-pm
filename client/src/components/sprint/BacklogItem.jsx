import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { Typography, Paper, Chip, Grid, IconButton, Tooltip, Button } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { deleteTask, updateTask, createTask, updateTaskStatus } from "../../services/taskServices";
import { updateBacklogItem } from '../../services/backlogServices';

import TaskDialog from "./TaskDialog";


/**
 * Component for displaying a backlog item with its tasks.
 * Allows creating, editing, and deleting tasks.
 * Also allows changing the status of tasks and the status of the backlog item.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.item - The backlog item to display.
 * @param {Array} props.backlogItems - The array of backlog items.
 * @param {Function} props.setBacklogItems - The function to update the backlog items array.
 * @param {Array} props.assignments - The array of assignments.
 */
export default function BacklogItem({
    item,
    backlogItems,
    setBacklogItems,
    assignments,
}) {
    
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
    const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
    const [isAssigneeDialogOpen, setIsAssigneeDialogOpen] = useState(false);
    const [addedTask, setAddedTask] = useState({ title: '', description: '', assignee: '' });
    const [editedTask, setEditedTask] = useState({ title: '', description: '', assignee: '' });

    const itemStatusColors = {
        'To Do': 'red',
        'In Progress': 'orange',
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

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            // update task status in the database
            await updateTaskStatus(taskId, newStatus, item._id);
            const updatedBacklogItems = backlogItems.map(item => {
                item.tasks = item.tasks.map(task => {
                    if (task._id === taskId) {
                        task.status = newStatus;
                    }
                    return task;
                });
                return item;
            });
            setBacklogItems(updatedBacklogItems);

            // calculate the new backlog item status and update it in the database
            await updateBacklogItemStatus();

        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleAddTaskClick = () => {
        setAddedTask({ title: '', description: '', assignee: '' });
        setIsAddTaskDialogOpen(true);
    };

    const handleEditTaskClick = (task) => {
        setEditedTask(task);
        setIsEditTaskDialogOpen(true);
    };

    const handleAssigneeClick = (task) => {
        setEditedTask(task);
        setIsAssigneeDialogOpen(true);
    };

    const handleAddTask = async () => {
        const backlogItemId = item._id;

        if (addedTask.title.trim() === '' || addedTask.description.trim() === '') {
            console.log('Task title and description are required.');
            alert('Task title and description are required.');
            return;
        }

        try {
            const createdTask = await createTask(backlogItemId, item.projectId, addedTask);

            setIsAddTaskDialogOpen(false);

            const updatedBacklogItems = backlogItems.map(item => {
                if (item._id === backlogItemId) {
                    // add _id of the new created task
                    addedTask._id = createdTask._id;
                    addedTask.status = 'To Do';
                    item.tasks.push(addedTask);
                }
                return item;
            });

            setBacklogItems(updatedBacklogItems);
            setAddedTask({ title: '', description: '', assignee: '' });
        } catch (error) {
            console.error('Error creating new task:', error);
        }
    };

    //  edit task handler
    const handleEditTask = async () => {
        const backlogItemId = item._id;
        try {
            await updateTask(editedTask._id, editedTask);
        
            setIsEditTaskDialogOpen(false);
            setIsAssigneeDialogOpen(false); // in case of assignee dialog

            const updatedBacklogItems = backlogItems.map(item => {
                if (item._id === backlogItemId) {
                    item.tasks = item.tasks.map(task => {
                        if (task._id === editedTask._id) {
                            return editedTask;
                        }
                        return task;
                    })
                }
                return item;
            });

            setBacklogItems(updatedBacklogItems);

        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // add task dialog change handler
    const handleAddTaskChange = (e) => {
        const { name, value } = e.target;
        setAddedTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    // edit task dialog change handler
    const handleEditTaskChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    // add task dialog assignee change handler
    const handleAssigneeChangeInAdd = (e) => {
        const newAssigneeId = e.target.value;
        const newAssignedUser = assignments.find(a => a.userId === newAssigneeId).user;
        setAddedTask((prevTask) => ({
            ...prevTask,
            assignee: newAssignedUser,
        }));
    };

    // edit task dialog assignee change handler
    const handleAssigneeChangeInEdit = (e) => {
        const newAssigneeId = e.target.value;
        const newAssignedUser = assignments.find(a => a.userId === newAssigneeId).user;
        setEditedTask((prevTask) => ({
            ...prevTask,
            assignee: newAssignedUser,
        }));
    };

    // delete task handler
    const handleDeleteTask = async (taskId, backlogItemId) => {
        try {
            await deleteTask(taskId, backlogItemId);
            const updatedBacklogItems = backlogItems.map(item => {
                item.tasks = item.tasks.filter(task => task._id !== taskId);
                return item;
            });
            setBacklogItems(updatedBacklogItems);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };


    const updateBacklogItemStatus = async () => {
        
        const totalTasks = item.tasks.length;
        const doneTasks = item.tasks.filter(task => task.status === 'Done').length;
        const inProgressTasks = item.tasks.filter(task => task.status === 'In Progress').length;

        let newStatus = 'To Do';
        
        if (doneTasks === totalTasks) {
            newStatus = 'Done';
        } else if (inProgressTasks > 0) {
            newStatus = 'In Progress';
        }

        
        if (item.status !== newStatus) {
            item.status = newStatus;
            await updateBacklogItem(item._id, { status: newStatus });
        }
    };


    return (
        <Paper elevation={3} style={{ padding: 16, marginBottom: 16, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'top', backgroundColor: itemStatusColors[item.status], padding: '8px 16px', borderRadius: 4 }}>
                {/* Item information */}
                <div>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body1">{item.description}</Typography>
                </div>

                {/* Add task button  */}
                <div style={{ marginLeft: '50px' }}>
                    <Button variant="contained" color="secondary" onClick={() => handleAddTaskClick()} >Add Task</Button>
                </div>
            </div>

            {/* Item Status */}
            <Typography
                variant="caption"
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    padding: '4px 8px',
                }}
            >
                {item.status}
            </Typography>

            {/* Droppable tasks area */}
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
                                            
                                            {/* Item information and operations */}
                                            <Grid item xs={8} sm={9}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8} sm={6}>
                                                        <div>
                                                            <Typography variant="body2" gutterBottom>{task.title}</Typography>
                                                            <Typography variant="caption" display="block" gutterBottom>{task.description}</Typography>
                                                            <Typography variant="caption" display="block" gutterBottom color={task && task.assignee ? 'primary' : 'red'}>assignee: {task && task.assignee ? task.assignee.username : 'UNASSIGNED'} </Typography>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={4} sm={6}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                            <Tooltip title="Responsible assignment" arrow>
                                                                <div>
                                                                    <IconButton onClick={() => handleAssigneeClick(task)} color={task && task.assignee ? 'default' : 'secondary'}> 
                                                                        <AssignmentIndIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                            <Tooltip title="Delete task" arrow>
                                                                <div>
                                                                    <IconButton onClick={() => handleDeleteTask(task._id, item._id)}>
                                                                        <DeleteIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                            <Tooltip title="Edit task" arrow>
                                                                <div>
                                                                    <IconButton onClick={() => handleEditTaskClick(task)}>
                                                                        <EditIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                            {/* Item status change management */}
                                            <Grid item xs={4} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                                <Grid container spacing={1}>
                                                    {['To Do', 'In Progress', 'Done'].map((status) => (
                                                        <Grid item key={status}>
                                                            <Chip
                                                                label={status}
                                                                variant="outlined"
                                                                sx={{
                                                                    backgroundColor: status === task.status ? getTaskStatusColor(task.status) : 'default',
                                                                    color: status === task.status ? 'white' : getTaskStatusColor(status),
                                                                    cursor: status === task.status ? 'default' : 'pointer',
                                                                    '&:hover': status !== task.status ?  {
                                                                        backgroundColor: getTaskStatusColor(status),
                                                                        color: getTaskStatusColor(status),
                                                                        borderColor: getTaskStatusColor(status),
                                                                        transition: 'background-color 0.3s ease',
                                                                        transition: 'color 0.3s ease',
                                                                    } : {
                                                                        backgroundColor: getTaskStatusColor(status),
                                                                    },
                                                                }}
                                                                onClick={() => handleTaskStatusChange(task._id, status)}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Edit Task Dialog */}
            <TaskDialog
                isTaskDialogOpen={isEditTaskDialogOpen}
                newTask={editedTask}
                handleTaskSave={handleEditTask}
                onClose={() => setIsEditTaskDialogOpen(false)} 
                assignments={assignments}
                handleTaskChange={handleEditTaskChange}
                handleAssigneeChange={handleAssigneeChangeInEdit}

            />
            
            {/* Add Task Dialog */}
            <TaskDialog
                isTaskDialogOpen={isAddTaskDialogOpen}
                newTask={addedTask}
                handleTaskSave={handleAddTask}
                onClose={() => setIsAddTaskDialogOpen(false)}
                isAddTaskDisabled={false}
                assignments={assignments}
                handleTaskChange={handleAddTaskChange}
                handleAssigneeChange={handleAssigneeChangeInAdd}

            />

            {/* Assignee selection Dialog */}
            <TaskDialog
                isTaskDialogOpen={isAssigneeDialogOpen}
                newTask={editedTask}
                handleTaskSave={handleEditTask}
                onClose={() => setIsAssigneeDialogOpen(false)}
                isAssigneeMode={true}
                assignments={assignments}
                handleTaskChange={handleEditTaskChange}
                handleAssigneeChange={handleAssigneeChangeInEdit}
            />
        </Paper>
    )
}

