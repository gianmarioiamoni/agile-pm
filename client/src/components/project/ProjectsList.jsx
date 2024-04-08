// ProjectsList.jsx
import React from 'react';
import { Grid } from '@mui/material';
import ProjectComponent from './ProjectComponent';

const ProjectsList = ({ projects }) => {
    return (
        <Grid container spacing={3}>
            {projects.map(project => (
                <Grid item key={project.id} xs={12} sm={6} md={4}>
                    <ProjectComponent project={project} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProjectsList;
