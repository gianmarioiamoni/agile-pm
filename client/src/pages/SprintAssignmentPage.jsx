import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Grid, Typography } from '@mui/material';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import axios from 'axios';

import { getAvailableTasksAndSprintTasks } from '../services/taskServices';

// const initialAvailableTasks = [
//     { id: 'task1', content: 'Task 1' },
//     { id: 'task2', content: 'Task 2' },
//     { id: 'task3', content: 'Task 3' },
// ];

export default function SprintAssignmentPage() {
    const { sprintId } = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);
    const [sprintTasks, setSprintTasks] = useState([]);

    useEffect(() => {
        const fetchAvailableTasks = async () => {
            const tasks = await getAvailableTasksAndSprintTasks();
            setAvailableTasks(tasks.tasks);
            const sprintTasks = tasks.sprints.find((sprint) => sprint._id === sprintId);
            setSprintTasks(sprintTasks.tasks);
        };
        fetchAvailableTasks();
        console.log("Available tasks fetched");
    }, []);

    const handleDragEnd = async (result) => {
        console.log("Handle drag end called");
        const { source, destination } = result;

        if (!destination) {
            console.log("Destination is undefined");
            return;
        }

        console.log(`source.droppableId: ${source.droppableId}`);
        console.log(`destination.droppableId: ${destination.droppableId}`);

        if (source.droppableId === destination.droppableId) {
            console.log("Drop within same droppable");
            const items = source.droppableId === 'availableTasks' ? Array.from(availableTasks) : Array.from(sprintTasks);
            console.log(`items.length: ${items.length}`);
            const [removed] = items.splice(source.index, 1);
            console.log(`removed: ${removed}`);
            items.splice(destination.index, 0, removed);
            console.log(`items after splice: ${items}`);

            if (source.droppableId === 'availableTasks') {
                console.log("Updating available tasks");
                setAvailableTasks(items);
            } else {
                console.log("Updating sprint tasks");
                setSprintTasks(items);
            }
        } else {
            console.log("Drop between different droppables");
            const sourceItems = source.droppableId === 'availableTasks' ? Array.from(availableTasks) : Array.from(sprintTasks);
            console.log(`sourceItems: ${sourceItems}`);
            const destItems = destination.droppableId === 'availableTasks' ? Array.from(availableTasks) : Array.from(sprintTasks);
            console.log(`destItems: ${destItems}`);
            const [removed] = sourceItems.splice(source.index, 1);
            console.log(`removed: ${removed}`);
            destItems.splice(destination.index, 0, removed);
            console.log(`destItems after splice: ${destItems}`);

            if (source.droppableId === 'availableTasks') {
                console.log("Updating available tasks and sprint tasks");
                setAvailableTasks(sourceItems);
                setSprintTasks(destItems);
                await updateTaskAssignment(removed._id, sprintId);
            } else {
                console.log("Updating available tasks and sprint tasks");
                setAvailableTasks(destItems);
                setSprintTasks(sourceItems);
                await updateTaskAssignment(removed._id, null);
            }
        }
    };

    const updateTaskAssignment = async (taskId, sprintId) => {
        try {
            await axios.post('/server/tasks/assign', { taskId, sprintId });
            console.log(`Task ${taskId} assigned to sprint ${sprintId}`);
        } catch (error) {
            console.error('Error assigning task:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Selected Sprint
                            </Typography>
                            <Typography variant="body1">{sprintId}</Typography>
                            <Droppable droppableId="sprintTasks">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            minHeight: '200px',
                                            padding: '10px',
                                            backgroundColor: '#f0f0f0',
                                            border: '1px dashed black',
                                        }}
                                    >
                                        {sprintTasks.length > 0 ? (
                                            sprintTasks.map((task, index) => (
                                                <Draggable key={task.key} draggableId={task.key} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                padding: '10px',
                                                                margin: '0 0 10px 0',
                                                                backgroundColor: '#f9f9f9',
                                                                border: '1px solid black',
                                                                cursor: 'pointer',
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            {task.content}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                Drag tasks here
                                            </Typography>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Available Tasks
                            </Typography>
                            <Typography variant="body1">{availableTasks.length}</Typography>
                            <Droppable droppableId="availableTasks">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            minHeight: '200px',
                                            padding: '10px',
                                            backgroundColor: '#f0f0f0',
                                            border: '1px dashed black',
                                        }}
                                    >
                                        {availableTasks != null && availableTasks?.map((task, index) => (
                                            <Draggable key={task.key} draggableId={task.key} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            padding: '10px',
                                                            margin: '0 0 10px 0',
                                                            backgroundColor: '#f9f9f9',
                                                            border: '1px solid black',
                                                            cursor: 'pointer',
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        {task.content}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Paper>
                    </Grid>
                </Grid>
            </DragDropContext>
        </div>
    );
}
