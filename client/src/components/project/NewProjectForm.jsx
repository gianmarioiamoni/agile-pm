// NewProjectForm.jsx
import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';

const NewProjectForm = ({ onCreateProject, isCreable = true }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateProject({ name, description });
        setName('');
        setDescription('');
    };

    return (
        // <form onSubmit={handleSubmit} disabled={!isCreable}>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <TextField
                        disabled={!isCreable}
                        fullWidth
                        label="Project Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        disabled={!isCreable}
                        fullWidth
                        multiline
                        label="Project Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" disabled={!isCreable}>
                        Create Project
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default NewProjectForm;
