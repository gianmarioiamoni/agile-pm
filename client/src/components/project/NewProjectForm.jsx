// NewProjectForm.jsx
import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';


/**
 * Component for creating a new project.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onCreateProject - The function called when a new project is created.
 * @param {boolean} [props.canCreateProject=true] - Whether the user can create a new project.
 */
const NewProjectForm = ({ onCreateProject, canCreateProject = true }) => {
    // State variables for project name and description
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    /**
     * Handles the form submission event.
     * Calls the onCreateProject function with the project name and description.
     * Resets the form fields.
     *
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateProject({ name, description });
        setName('');
        setDescription('');
    };

    return (
        // Form for creating a new project
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    {/* Project name input */}
                    <TextField
                        disabled={!canCreateProject}
                        fullWidth
                        label="Project Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* Project description input */}
                    <TextField
                        disabled={!canCreateProject}
                        fullWidth
                        multiline
                        label="Project Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* Create project button */}
                    <Button type="submit" variant="contained" color="primary" disabled={!canCreateProject}>
                        Create Project
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default NewProjectForm;
