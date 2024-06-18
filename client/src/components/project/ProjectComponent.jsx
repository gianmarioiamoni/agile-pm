
// ProjectComponent.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

/**
 * ProjectComponent is a React component that renders a card with project information.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.project - The project object containing project name and description.
 * @return {JSX.Element} The rendered project card.
 */
const ProjectComponent = ({ project }) => {
    // Render a card with project name and description.
    return (
        <Card>
            <CardContent>
                {/* Render project name */}
                <Typography variant="h5" component="div">
                    {project.name}
                </Typography>
                {/* Render project description */}
                <Typography variant="body2" color="text.secondary">
                    {project.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProjectComponent;
