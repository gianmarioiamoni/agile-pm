// ProjectsList.jsx
import React from 'react';
import { Grid, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function ProjectsList ({ projects, onEdit, onDelete }) {
    return (
        <div>
            {projects.map(project => (
                <Grid container key={project.id} spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        <Typography variant="subtitle1">{project.name}</Typography>
                        <Typography variant="body2">{project.description}</Typography>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                        <IconButton onClick={() => onEdit(project)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => onDelete(project)}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
};


