import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function ProjectInfo({ project }) {

    if (!project) {
        return null;
    }

    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">{project.name}</Typography>
            <Typography variant="body1">{project.description}</Typography>
            <Typography variant="subtitle1" gutterBottom>Assigned Resources:</Typography>
            <List>
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
