import React from 'react';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

/**
 * Component to render a form for creating a new task.
 *
 * @param {Object} props - Component props
 * @param {Function} props.handleNewTaskChange - Function to handle task form field change
 * @param {Object} props.newTask - Object containing new task data
 * @param {boolean} [props.isAssigneeMode=false] - Flag indicating if the form is in assignee mode
 * @param {Function} props.handleAssigneeChange - Function to handle assignee select change
 * @param {Array} props.assignments - Array of assignments
 * @returns {JSX.Element} - Rendered form component
 */
export default function NewTaskForm({
    handleNewTaskChange,
    newTask,
    isAssigneeMode = false,
    handleAssigneeChange,
    assignments,
}) {
    
    
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
                autoFocus
                disabled={isAssigneeMode}
            />
            <TextField
                label="Description"
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                fullWidth
                margin="dense"
                required
                multiline
                rows={4}
                disabled={isAssigneeMode}
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









