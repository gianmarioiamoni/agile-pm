import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import NewTaskForm from "./NewTaskForm";



/**
 * TaskDialog component that renders a dialog for adding or editing a task.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isTaskDialogOpen - Whether the task dialog is open or not.
 * @param {Object} props.newTask - The new task object being edited or added.
 * @param {function} props.handleTaskSave - Function to handle saving the new task.
 * @param {function} props.onClose - Function to close the task dialog.
 * @param {boolean} [props.isAddTaskDisabled=true] - Whether the add task button is disabled or not.
 * @param {boolean} [props.isAssigneeMode=false] - Whether the task dialog is for assigning a resource to a task or not.
 * @param {function} props.handleTaskChange - Function to handle changes to the new task object.
 * @param {function} props.handleAssigneeChange - Function to handle changes to the assigned resource.
 * @param {Array} props.assignments - The assignments array.
 * @returns {JSX.Element|null} The rendered task dialog component or null if the task dialog is not open.
 */
export default function TaskDialog({
    isTaskDialogOpen,
    newTask,
    handleTaskSave,
    onClose,
    isAddTaskDisabled = true,
    isAssigneeMode = false,
    handleTaskChange,
    handleAssigneeChange,
    assignments }) {
    
    // If the task dialog is not open, return null
    if (!isTaskDialogOpen) {
        return null;
    }

    return (
        // Render the task dialog component
        <Dialog open={isTaskDialogOpen} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {isAssigneeMode ? 
                    'Assign Resource to Task' : 
                    (isAddTaskDisabled ? 'Edit Task' : 'Add Task')}
            </DialogTitle>
            <DialogContent>
                {newTask && (
                    // Render the NewTaskForm component
                    <NewTaskForm
                        handleNewTaskChange={handleTaskChange}
                        newTask={newTask}
                        isAddTaskDisabled={isAddTaskDisabled}
                        isAssigneeMode={isAssigneeMode}
                        handleAssigneeChange={handleAssigneeChange}
                        assignments={assignments}
                    />
                )}
            </DialogContent>
            <DialogActions>
                {/* Render the cancel button */}
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                {/* Render the save button */}
                <Button onClick={handleTaskSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}
