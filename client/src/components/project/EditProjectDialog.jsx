// EditProjectDialog.jsx

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditProjectForm from './EditProjectForm';

/**
 * Dialog component for editing a project.
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Whether the dialog is open or not.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {function} props.onEdit - Function to edit the project.
 * @param {Object} props.project - The project to edit.
 * @returns {JSX.Element} - The rendered dialog component.
 */
export default function EditProjectDialog({ open, onClose, onEdit, project }) {
    // State to hold the edited project
    const [editedProject, setEditedProject] = useState(project);

    /**
     * Handles the save event by calling the onEdit function with the edited project
     * and then closing the dialog.
     */
    const handleEditProject = () => {
        onEdit(editedProject);
        onClose();
    };

    /**
     * Handles the input change event by updating the edited project state.
     * @param {Object} e - The event object.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({ ...editedProject, [name]: value });
    };

    // When the project prop changes, update the edited project state
    useEffect(() => {
        if (project != null) {
            setEditedProject({ ...project });
        }
    }, [project])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogContent>
                {/* Render the edit project form */}
                <EditProjectForm project={editedProject} onInputChange={handleInputChange} />
            </DialogContent>
            <DialogActions>
                {/* Render the cancel and save buttons */}
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleEditProject}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}



