import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Box, Container, Card, CardContent, TextField, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Header from "../components/Header";
import TaskCard from "../components/task/TaskCard";
import { getSprint } from "../services/sprintServices";
import { updateTaskStatus, getTasksByBacklogItemId, createTask } from "../services/taskServices";
import { getBacklogItem, updateBacklogItem } from "../services/backlogServices";

/**
 * Page for managing tasks within a sprint.
 */
export default function SprintTasksStatusPage() {
    const { sprintId } = useParams();
    const [sprint, setSprint] = useState(null);
    const [backlogItems, setBacklogItems] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [currentBacklogItemId, setCurrentBacklogItemId] = useState(null);

    useEffect(() => {
        const fetchSprint = async () => {
            try {
                const sprintData = await getSprint(sprintId);
                console.log('SprintTasksPage: fetchSprint: sprintData:', sprintData);

                setSprint(sprintData);

                if (sprintData.items && sprintData.items.length > 0) {
                    sprintData.items.forEach(item => console.log('Item:', item));

                    const itemPromises = sprintData.items.map(async (item) => {
                        const itemId = item._id || item;
                        const itemData = await getBacklogItem(itemId);
                        console.log(`SprintTasksPage: fetchSprint: itemData for itemId ${itemId}:`, itemData);

                        const tasks = await getTasksByBacklogItemId(itemId);
                        console.log(`SprintTasksPage: fetchSprint: tasks for itemId ${itemId}:`, tasks);
                        itemData.tasks = tasks;
                        return itemData;
                    });

                    const itemsData = await Promise.all(itemPromises);
                    console.log('SprintTasksPage: fetchSprint: itemsData:', itemsData);
                    setBacklogItems(itemsData);
                } else {
                    console.log('SprintTasksPage: fetchSprint: No items found in sprintData');
                }
            } catch (error) {
                console.error('Error fetching sprint:', error);
            }
        };

        fetchSprint();
    }, [sprintId]);

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        const sourceDroppableId = result.source.droppableId;
        const destinationDroppableId = result.destination.droppableId;

        if (sourceDroppableId === destinationDroppableId && sourceIndex === destinationIndex) {
            return;
        }

        const updatedBacklogItems = [...backlogItems];
        const sourceItemIndex = updatedBacklogItems.findIndex(item => item._id === sourceDroppableId);
        const destinationItemIndex = updatedBacklogItems.findIndex(item => item._id === destinationDroppableId);

        const sourceItem = updatedBacklogItems[sourceItemIndex];
        const [movedTask] = sourceItem.tasks.splice(sourceIndex, 1);

        if (sourceItemIndex === destinationItemIndex) {
            sourceItem.tasks.splice(destinationIndex, 0, movedTask);
        } else {
            const destinationItem = updatedBacklogItems[destinationItemIndex];
            destinationItem.tasks.splice(destinationIndex, 0, movedTask);
        }

        setBacklogItems(updatedBacklogItems);

        // Update task status and item state in backend
        await updateTaskStatus(movedTask._id, destinationDroppableId);
        await updateBacklogItemState(sourceItem);
        if (sourceItemIndex !== destinationItemIndex) {
            await updateBacklogItemState(updatedBacklogItems[destinationItemIndex]);
        }
    };

    const updateBacklogItemState = async (backlogItem) => {
        const totalTasks = backlogItem.tasks.length;
        const doneTasks = backlogItem.tasks.filter(task => task.status === 'Done').length;

        let newStatus = 'To Do';
        if (doneTasks === totalTasks) {
            newStatus = 'Done';
        } else if (doneTasks > 0) {
            newStatus = 'In Progress';
        }

        if (backlogItem.status !== newStatus) {
            backlogItem.status = newStatus;
            await updateBacklogItem(backlogItem._id, { status: newStatus });
        }
    };

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTask = async (backlogItemId) => {
        console.log('handleAddTask is called with backlogItemId:', backlogItemId);
        if (newTask.title.trim() === '') {
            console.log('Task title is required.');
            alert('Task title is required.');
            return;
        }

        try {
            console.log('About to create new task with backlogItemId:', backlogItemId, 'and newTask:', newTask);
            const createdTask = await createTask(backlogItemId, sprintId, newTask);
            console.log('New task created:', createdTask);

            const updatedBacklogItems = backlogItems.map(item => {
                console.log('Mapping backlogItems:', item);
                if (item._id === backlogItemId) {
                    console.log('Found backlogItem with id:', backlogItemId);
                    item.tasks.push(createdTask);
                }
                console.log('Updated backlogItem:', item);
                return item;
            });

            console.log('Updated backlogItems:', updatedBacklogItems);
            setBacklogItems(updatedBacklogItems);
            console.log('Setting backlogItems to updatedBacklogItems in handleAddTask.');
            setNewTask({ title: '', description: '' });
            console.log('Setting newTask to empty object in handleAddTask.');
            setCurrentBacklogItemId(null);
            console.log('Setting currentBacklogItemId to null in handleAddTask.');
        } catch (error) {
            console.error('Error creating new task:', error);
        }
    };

    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} />

            <Container style={{ marginTop: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Tasks for Sprint {sprint ? sprint.name : ''}
                </Typography>

                <DragDropContext onDragEnd={handleDragEnd}>
                    {backlogItems?.map(item => (
                        <Droppable droppableId={item._id} key={item._id}>
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{ marginBottom: 2 }}
                                >
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                                        </CardContent>
                                    </Card>
                                    <Grid container spacing={2}>
                                        {item.tasks.map((task, index) => (
                                            <Draggable draggableId={task._id} index={index} key={task._id}>
                                                {(provided) => (
                                                    <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <TaskCard task={task} />
                                                    </Grid>
                                                )}
                                            </Draggable>
                                        ))}
                                    </Grid>
                                    {provided.placeholder}
                                    <Box mt={2}>
                                        <Typography variant="h6">Add New Task</Typography>
                                        <TextField
                                            label="Title"
                                            name="title"
                                            value={newTask.title}
                                            onChange={handleNewTaskChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Description"
                                            name="description"
                                            value={newTask.description}
                                            onChange={handleNewTaskChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAddTask(item._id)}
                                        >
                                            Add Task
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </Container>
        </>
    );
}

