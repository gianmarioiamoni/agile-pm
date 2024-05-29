import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';

import Header from "../components/Header";
import BacklogItem from "../components/sprint/BacklogItem";

import { getSprint } from "../services/sprintServices";
import { updateTaskStatus, getTasksByBacklogItemId, createTask, deleteTask } from "../services/taskServices";
import { getBacklogItem, updateBacklogItem } from "../services/backlogServices";
import { getAssignments } from "../services/assignmentServices"; // Import the getAssignments function

export default function SprintTasksStatusPage() {
    const { sprintId } = useParams();
    const [sprint, setSprint] = useState(null);
    const [backlogItems, setBacklogItems] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' });
    const [currentBacklogItemId, setCurrentBacklogItemId] = useState(null);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchSprintAndAssignments = async () => {
            try {
                const sprintData = await getSprint(sprintId);
                setSprint(sprintData);

                if (sprintData.items && sprintData.items.length > 0) {
                    const itemPromises = sprintData.items.map(async (item) => {
                        const itemId = item._id || item;
                        const itemData = await getBacklogItem(itemId);
                        const tasks = await getTasksByBacklogItemId(itemId);
                        itemData.tasks = tasks;
                        return itemData;
                    });

                    const itemsData = await Promise.all(itemPromises);
                    setBacklogItems(itemsData);
                } else {
                    console.log('SprintTasksPage: fetchSprint: No items found in sprintData');
                }

                if (sprintData.projectId) {
                    const assignmentsData = await getAssignments(sprintData.projectId);
                    setAssignments(assignmentsData);
                    console.log('assignments:', assignmentsData);

                    setNewTask({ title: '', description: '', assignee: '' });
                }

                

            } catch (error) {
                console.error('Error fetching sprint and assignments:', error);
            }
        };

        fetchSprintAndAssignments();
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

        await updateTaskStatus(movedTask._id, sourceItem, destinationDroppableId);
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

    const handleAssigneeChange = (e) => {
        const { value } = e.target;
        setNewTask(prevState => ({
            ...prevState,
            assignee: value
        }));
    };

    const handleAddTask = async (backlogItemId) => {
        if (newTask.title.trim() === '' || newTask.description.trim() === '' ) {
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


    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus, currentBacklogItemId);
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

    const isAddTaskDisabled = newTask.title.trim() === '' || newTask.description.trim() === '';

    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} />

            <Container style={{ marginTop: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Tasks for Sprint <Box component="span" color="primary.main" fontWeight="fontWeightBold">{sprint ? sprint.name : ''}</Box>
                </Typography>

                <DragDropContext onDragEnd={handleDragEnd}>
                    {backlogItems?.map(item => (
                        <BacklogItem
                            key={item._id} // unique key for list elemnts
                            item={item}
                            handleTaskStatusChange={handleTaskStatusChange}
                            handleNewTaskChange={handleNewTaskChange}
                            handleAddTask={handleAddTask}
                            handleDeleteTask={handleDeleteTask}
                            newTask={newTask}
                            isAddTaskDisabled={isAddTaskDisabled}
                            assignments={assignments}
                            handleAssigneeChange={handleAssigneeChange}  
                        />
                    ))}
                </DragDropContext>
            </Container>
        </>
    );
}


