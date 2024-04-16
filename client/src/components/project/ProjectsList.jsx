// ProjectsList.jsx
import React from 'react';
import { Grid, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function ProjectsList({ projects, onEdit, onDelete, isEditable = true, isDeletable = true }) {
    console.log("ProjectsList() - projects: ", projects)
    return (
        <div>
            {projects != null && projects.map(project => (
                <Grid container key={project.id} spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        <Typography variant="subtitle1">{project.name}</Typography>
                        <Typography variant="body2">{project.description}</Typography>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                        <IconButton onClick={() => onEdit(project)} disabled={!isEditable}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => onDelete(project)} disabled={!isDeletable}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
};



