import React from 'react';
import { Link } from 'react-router-dom';

import { Paper, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';


/**
 * Component to display the sprint backlog
 * @param {Object} props - Component props
 * @param {Array} props.sprints - Array of sprint objects with items
 * @returns {JSX.Element} - The rendered component
 */
export default function SprintBacklog({ sprints }) {

    // Return null if sprints is undefined
    if (!sprints) {
        return null;
    }

    return (
        // Outer container
        <Paper elevation={3} style={{ padding: 16 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* Title */}
                <Typography variant="h6">Sprint Backlog</Typography>
                {/* Button to navigate to Sprint Management page */}
                <Button component={Link} to={`/sprints-management/${sprints[0].projectId}`} variant="contained" color="secondary" size="small">
                    Go to Sprints Management
                </Button>
            </Box>
            {/* Loop through each sprint */}
            {sprints.map((sprint) => (
                <div key={sprint._id}>
                    {/* Sprint name */}
                    <Typography variant="subtitle1">{sprint.name}</Typography>
                    {/* Sprint start and end dates */}
                    <Typography variant="body2">start: {new Date(sprint.startDate).toLocaleDateString()} - end: {new Date(sprint.endDate).toLocaleDateString()}</Typography>
                    {/* List of items in the sprint */}
                    <List>
                        {sprint.items?.map((item) => (
                            <ListItem key={item._id}>
                                {/* Item title and description */}
                                <ListItemText
                                    primary={item.title}
                                    secondary=
                                    <Box component="span" width={'auto'}>
                                        <Box component="span" display="block" variant="body2" fontWeight="fontWeightMedium">
                                            {item.description}
                                        </Box>
                                        {/* Item status */}
                                        <Box component="span" display="block" variant="caption" minWidth="250px">
                                            {item.status}
                                        </Box>
                                    </Box>
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            ))}
        </Paper>
    );
}
