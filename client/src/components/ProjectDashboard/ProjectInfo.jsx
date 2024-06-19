import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box, Grid } from '@mui/material';

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
        <Paper elevation={3} style={{ padding: 16, width: '100%' }}>
            <Box mt={2} mb={2} p={2} border="1px solid #ccc" borderRadius="4px" sx={{ width: '100%' }}>
                <Grid container spacing={2} alignItems="flex-start" justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">{project.project.description}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Assigned Resources:</Typography>
                        <List dense>
                            {project.assignments?.map((assigned) => (
                                <ListItem key={assigned.userId._id} disableGutters>
                                    <ListItemText
                                        primary={`${assigned.userId.username} - ${assigned.roleId.roleDescription}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};
