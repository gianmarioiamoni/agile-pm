import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function NewTaskForm({ backlogItemId, handleNewTaskChange, handleAddTask, newTask, isAddTaskDisabled }) {
    return (
        <Box mt={2}>
            <Typography variant="h6">Add New Task</Typography>
            <TextField
                label="Title"
                name="title"
                value={newTask.title}
                onChange={handleNewTaskChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Description"
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                fullWidth
                margin="normal"
                required
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddTask(backlogItemId)}
                disabled={isAddTaskDisabled}
            >
                Add Task
            </Button>
        </Box>
    );
};

