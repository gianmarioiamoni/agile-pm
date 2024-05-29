import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { Typography, Paper, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { deleteTask, updateTask, createTask } from "../../services/taskServices";

import TaskDialog from "./TaskDialog";
import NewTaskForm from "./NewTaskForm";

export default function BacklogItem({
    item,
    backlogItems,
    setBacklogItems,
    assignments,
    // handleAssigneeChange,
}) {
    console.log("backlogItems", backlogItems);
    console.log("item", item);
    console.log("assignments", assignments);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' });
    const [editedTask, setEditedTask] = useState({ title: '', description: '', assignee: '' });
    // const [currentBacklogItemId, setCurrentBacklogItemId] = useState({});

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

    // edit task dialog opening
    const handleEditTaskClick = (task) => {
        console.log('edit task clicked', task);
        setEditedTask(task);
        setIsTaskDialogOpen(true);
        console.log('is task dialog open set to', isTaskDialogOpen);
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
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
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleAssigneeChange = (e) => {
        const { value } = e.target;
        setNewTask(prevState => ({
            ...prevState,
            assignee: value
        }));
    };

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTask = async () => {
        const backlogItemId = item._id;

        if (newTask.title.trim() === '' || newTask.description.trim() === '') {
            console.log('Task title and description are required.');
            alert('Task title and description are required.');
            return;
        }

        try {
            const createdTask = await createTask(backlogItemId, sprintId, newTask);

            const updatedBacklogItems = backlogItems.map(item => {
                if (item._id === backlogItemId) {
                    item.tasks.push(createdTask);
                }
                return item;
            });

            setBacklogItems(updatedBacklogItems);
            setNewTask({ title: '', description: '', assignee: '' });
            setCurrentBacklogItemId(null);
        } catch (error) {
            console.error('Error creating new task:', error);
        }
    };

    const handleEditTask = async () => {
        const backlogItemId = item._id;
        try {
            console.log("handleEditTask() - editedTask:", editedTask);
            await updateTask(editedTask._id, editedTask);
        
            setIsTaskDialogOpen(false);

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

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            const updatedBacklogItems = backlogItems.map(item => {
                item.tasks = item.tasks.filter(task => task._id !== taskId);
                return item;
            });
            setBacklogItems(updatedBacklogItems);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEditTaskChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };


    const handleAssigneeChangeInEdit = (e) => {
        const newAssigneeId = e.target.value;
        const newAssignedUser = assignments.find(a => a.userId === newAssigneeId).user;
        console.log("newAssignedUser:", newAssignedUser);
        console.log('handleAssigneeChangeInEdit() - e.target.value:', e.target.value);
        console.log("handleAssigneeChangeInEdit() - editedTask:", editedTask);
        setEditedTask((prevTask) => ({
            ...prevTask,
            assignee: newAssignedUser,
        }));
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
                                                                    {/* <IconButton onClick={() => handleAssignee(task._id, task.assignee)}> */}
                                                                    <IconButton onClick={() => console.log("change assignee for task: ", task._id, " new assignee: ", task.assignee)}>
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
                                                                    <IconButton onClick={() => handleEditTaskClick(task)}>
                                                                        <EditIcon fontSize='small' />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
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
                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Add a new task */}
            {/* <NewTaskForm
                backlogItemId={item._id}
                handleNewTaskChange={handleNewTaskChange}
                newTask={newTask}
                assignments={assignments}
                handleAssigneeChange={(e) => handleAssigneeChange(e)}
            /> */}

            {/* Edit Task Dialog */}
            {/* <Dialog open={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
                <DialogContent>
                    {currentTask && (
                        <NewTaskForm
                            backlogItemId={item._id}
                            handleNewTaskChange={handleEditTaskChange}
                            handleAddTask={handleEditTaskSave}
                            newTask={currentTask}
                            isAddTaskDisabled={true}
                            assignments={assignments}
                            handleAssigneeChange={handleAssigneeChangeInEdit}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsTaskDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditTaskSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* Edit Task Dialog */}
            <TaskDialog
                isEditDialogOpen={isTaskDialogOpen}
                newTask={editedTask}
                handleTaskSave={handleEditTask}
                onClose={() => setIsTaskDialogOpen(false)} 
                isAddTaskDisabled={true}
                assignments={assignments}
                handleTaskChange={handleEditTaskChange}
                handleAssigneeChange={handleAssigneeChangeInEdit}

                />
        </Paper>
    )
}

