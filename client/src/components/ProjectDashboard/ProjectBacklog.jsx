import React from 'react';
import { Link } from 'react-router-dom';

import { Paper, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';

export default function ProjectBacklog({ backlog }) {

    if (!backlog) {
        return null;
    }
    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Project Backlog</Typography>
                {/* Button to navigate to Backlog page */}
                <Button component={Link} to={`/project/${backlog[0].projectId}/backlog`} variant="contained" color="secondary" size="small">
                    Go to Backlog
                </Button>
            </Box>
            <List>
                {backlog.map((item) => (
                    <ListItem key={item._id}>
                        <ListItemText
                            primary={item.title}
                            secondary={
                                <Box component="span" width={'auto'}>
                                    <Box component="span" display="block" variant="body2" fontWeight="fontWeightMedium">
                                        {item.description}
                                    </Box>
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