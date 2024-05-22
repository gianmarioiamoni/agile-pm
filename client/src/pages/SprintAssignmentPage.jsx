import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Grid, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialAvailableTasks = [
    { id: 'task1', content: 'Task 1' },
    { id: 'task2', content: 'Task 2' },
    { id: 'task3', content: 'Task 3' },
];

export default function SprintAssignmentPage() {
    const { sprintId } = useParams();
    const [availableTasks, setAvailableTasks] = useState(initialAvailableTasks);
    const [sprintTasks, setSprintTasks] = useState([]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            console.log("Destination is undefined");
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = source.droppableId === 'availableTasks' ? Array.from(availableTasks) : Array.from(sprintTasks);
            const [removed] = items.splice(source.index, 1);
            items.splice(destination.index, 0, removed);

            if (source.droppableId === 'availableTasks') {
                setAvailableTasks(items);
            } else {
                setSprintTasks(items);
            }
        } else {
            const sourceItems = source.droppableId === 'availableTasks' ? Array.from(availableTasks) : Array.from(sprintTasks);
            const destItems = destination.droppableId === 'availableTasks' ? Array.from(availableTasks) : Array.from(sprintTasks);
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            if (source.droppableId === 'availableTasks') {
                setAvailableTasks(sourceItems);
                setSprintTasks(destItems);
            } else {
                setAvailableTasks(destItems);
                setSprintTasks(sourceItems);
            }
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
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
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
                                        {availableTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
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
