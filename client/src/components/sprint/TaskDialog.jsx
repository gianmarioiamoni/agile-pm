import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import NewTaskForm from "./NewTaskForm";



export default function TaskDialog({
    isEditDialogOpen,
    newTask,
    handleTaskSave,
    onClose,
    isAddTaskDisabled = false,
    handleTaskChange,
    handleAssigneeChange,
    assignments }) {
    
    // console.log("TaskDialog props:", { item, isEditDialogOpen, newTask, handleTaskSave, onClose, isAddTaskDisabled, handleAssigneeChange, assignments });

    if (!isEditDialogOpen) {
        return null;
    }

    // const [currentTask, setCurrentTask] = useState({ ...newTask });
    
    // const handleEditTaskChange = (e) => {
    //     const { name, value } = e.target;
    //     setCurrentTask((prevTask) => ({
    //         ...prevTask,
    //         [name]: value,
    //     }));
    // };


    return (
            <Dialog open={isEditDialogOpen} onClose={onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{isAddTaskDisabled ? 'Edit Task' : 'Add Task'}</DialogTitle>
                <DialogContent>
                    {newTask && (
                        <NewTaskForm
                            handleNewTaskChange={handleTaskChange}
                            newTask={newTask}
                            isAddTaskDisabled={isAddTaskDisabled}
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