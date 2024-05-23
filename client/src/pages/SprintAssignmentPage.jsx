import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Paper, Grid, Typography, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Header from "../components/Header";
import { getAvailableTasksAndSprintTasks, updateTaskAssignment } from "../services/taskServices";

export default function SprintAssignmentPage() {
    const { sprintId } = useParams();
    const [availableTasks, setAvailableTasks] = useState([]);
    const [sprintTasks, setSprintTasks] = useState([]);
    const [sprintName, setSprintName] = useState('');

    useEffect(() => {
        const fetchAvailableTasks = async () => {
            const tasks = await getAvailableTasksAndSprintTasks();
            setAvailableTasks(tasks.tasks);
            const sprintTasks = tasks.sprints.find((sprint) => sprint._id === sprintId);
            setSprintTasks(sprintTasks.tasks);
            setSprintName(tasks.sprints.find((sprint) => sprint._id === sprintId).name);
        };
        fetchAvailableTasks();
    }, []);

    const handleDragEnd = async (result) => {
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
                await updateTaskAssignment(removed._id, sprintId);
            } else {
                setAvailableTasks(destItems);
                setSprintTasks(sourceItems);
                await updateTaskAssignment(removed._id, null);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do': return 'red';
            case 'In Progress': return 'orange';
            case 'Done': return 'green';
            default: return '#f9f9f9';
        }
    };

    return (
        <>
            <Header isShowProfile={true} isShowBack={true} />

            <div style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom sx={{ marginTop: '20px' }}>
                    Tasks Assignment for Sprint: {sprintName}
                </Typography>
                <Link to={`/sprint-task-status/${sprintId}`} style={{ marginBottom: '20px', display: 'block' }}>
                    <Button variant="contained" color="secondary">
                        Monitor Tasks Status
                    </Button>
                </Link>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Paper style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Selected Sprint Tasks
                                </Typography>
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
                                                                    backgroundColor: getStatusColor(task.status),
                                                                    border: '1px solid black',
                                                                    cursor: 'pointer',
                                                                    ...provided.draggableProps.style,
                                                                }}
                                                            >
                                                                <div style={{ fontWeight: 'bold', color: '#fff' }}>{task.title}</div>
                                                                <div style={{ fontWeight: 'lighter', color: '#fff' }}>{task.content}</div>
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
                                                            <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                                                            <div style={{ fontWeight: 'lighter' }}>{task.content}</div>
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
        </>
    );
}

