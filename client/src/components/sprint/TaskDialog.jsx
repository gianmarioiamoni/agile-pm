import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import NewTaskForm from "./NewTaskForm";



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
    
    if (!isTaskDialogOpen) {
        return null;
    }


    return (
        <Dialog open={isTaskDialogOpen} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{isAssigneeMode ? 'Assign Resource to Task' : (isAddTaskDisabled ? 'Edit Task' : 'Add Task')}</DialogTitle>
            <DialogContent>
                {newTask && (
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
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleTaskSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}