// EditProjectDialog.jsx

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditProjectForm from './EditProjectForm';

export default function EditProjectDialog({ open, onClose, onEdit, project }) {
    const [editedProject, setEditedProject] = useState(project);

    const handleEditProject = () => {
        onEdit(editedProject);
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({ ...editedProject, [name]: value });
    };

    useEffect(() => {
        if (project != null) {
            setEditedProject({ ...project });
        }
    }, [project])


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogContent>
                <EditProjectForm project={editedProject} onInputChange={handleInputChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleEditProject}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}



