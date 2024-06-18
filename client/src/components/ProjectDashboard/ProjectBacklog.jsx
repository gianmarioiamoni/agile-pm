import React from 'react';
import { Link } from 'react-router-dom';

import { Paper, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';

/**
 * Component that displays the project backlog.
 * @param {Object} props - Component props.
 * @param {Array} props.backlog - Array of backlog items.
 * @returns {JSX.Element|null} - Rendered component.
 */
export default function ProjectBacklog({ backlog }) {
    // If backlog is not provided, return null
    if (!backlog) {
        return null;
    }

    // Render the project backlog
    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Project Backlog</Typography>
                {/* Button to navigate to Backlog page */}
                <Button component={Link} to={`/project/${backlog[0].projectId}/backlog`} variant="contained" color="secondary" size="small">
                    Go to Backlog
                </Button>
            </Box>
            {/* List of backlog items */}
            <List>
                {backlog.map((item) => (
                    // Render each backlog item
                    <ListItem key={item._id}>
                        <ListItemText
                            primary={item.title}
                            secondary={
                                <Box component="span" width={'auto'}>
                                    {/* Description */}
                                    <Box component="span" display="block" variant="body2" fontWeight="fontWeightMedium">
                                        {item.description}
                                    </Box>
                                    {/* Goal */}
                                    <Box component="span" display="block" variant="caption" minWidth="250px">
                                        Goal: {item.goal}
                                    </Box>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};
