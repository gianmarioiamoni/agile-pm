import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';


/**
 * Component to display project information.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data
 * @param {string} props.project.name - Project name
 * @param {string} props.project.description - Project description
 * @param {Array} props.project.assignments - Assignments data
 * @returns {JSX.Element|null} - Rendered component
 */
export default function ProjectInfo({ project }) {

    // If project data is not available, return null
    if (!project) {
        return null;
    }

    return (
        // Paper component for project info
        <Paper elevation={3} style={{ padding: 16 }}>
            {/* Project name */}
            <Typography variant="h6">{project.name}</Typography>
            {/* Project description */}
            <Typography variant="body1">{project.description}</Typography>
            {/* Assigned resources */}
            <Typography variant="subtitle1" gutterBottom>Assigned Resources:</Typography>
            <List>
                {/* Map through assignments and render list items */}
                {project.assignments?.map((assigned) => (
                    <ListItem key={assigned.userId}>
                        <ListItemText
                            primary={`${assigned.username} - ${assigned.roleDescription}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};
