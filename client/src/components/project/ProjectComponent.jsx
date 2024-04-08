
// ProjectComponent.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ProjectComponent = ({ project }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {project.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProjectComponent;
