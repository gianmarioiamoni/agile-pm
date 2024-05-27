import React from 'react';
import { Box, Card, CardContent, Typography, Grid, IconButton, TextField, Button } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Task from "./Task"
import NewTaskForm from './NewTaskForm';

export function BacklogItem({ item, handleTaskStatusChange, handleNewTaskChange, handleAddTask, newTask, isAddTaskDisabled }) {
    return (
        <Droppable droppableId={item._id} key={item._id}>
            {(provided) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ marginBottom: 2, border: '1px solid', borderColor: item.status === 'Done' ? 'green' : item.status === 'In Progress' ? 'orange' : 'red', padding: 2, borderRadius: 2 }}
                >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6">{item.title}</Typography>
                            <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                        </CardContent>
                    </Card>
                    <Grid container spacing={2}>
                        {item.tasks.map((task, index) => (
                            <Task key={task._id} task={task} index={index} handleTaskStatusChange={handleTaskStatusChange} />
                        ))}
                    </Grid>
                    {provided.placeholder}
                    <NewTaskForm
                        backlogItemId={item._id}
                        handleNewTaskChange={handleNewTaskChange}
                        handleAddTask={handleAddTask}
                        newTask={newTask}
                        isAddTaskDisabled={isAddTaskDisabled}
                    />
                </Box>
            )}
        </Droppable>
    );
};

