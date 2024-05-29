import React from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function NewTaskForm({
    handleNewTaskChange,
    newTask,
    handleAssigneeChange,
    assignments,
}) {
    // console.log("NewTaskForm props:", { backlogItemId, handleNewTaskChange, handleAddTask, newTask, isAddTaskDisabled, handleAssigneeChange, assignments });
    
    
    return (
        <Box mt={2}>
            <TextField
                label="Title"
                name="title"
                value={newTask.title}
                onChange={handleNewTaskChange}
                fullWidth
                margin="dense"
                required
            />
            <TextField
                label="Description"
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                fullWidth
                margin="dense"
                required
            />
            <FormControl fullWidth>
            <InputLabel id="assignee-label">Assignee</InputLabel>
            <Select
                labelId="assignee-label"
                name="assignee"
                value={newTask && newTask.assignee ? newTask.assignee._id : ''}
                onChange={handleAssigneeChange}
                fullWidth
                margin="dense"
                sx={{ mt: 1 }}
            >
                {assignments.map((assignment) => (
                    <MenuItem key={assignment.userId} value={assignment.userId}>
                        {assignment.username} - {assignment.roleDescription}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        </Box>
    );
};









