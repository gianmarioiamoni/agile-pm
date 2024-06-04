import React from 'react';

import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

export default function ProjectBacklog({ backlog }) {

    if (!backlog) {
        return null;
    }

    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">Project Backlog</Typography>
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