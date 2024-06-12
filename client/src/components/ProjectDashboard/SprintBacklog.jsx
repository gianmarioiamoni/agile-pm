import React from 'react';
import { Link } from 'react-router-dom';

import { Paper, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';


export default function SprintBacklog({ sprints }) {

    if (!sprints) {
        return null;
    }


    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            {/* <Typography variant="h6">Sprint Backlog</Typography> */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Sprint Backlog</Typography>
                {/* Button to navigate to Sprint Management page */}
                <Button component={Link} to={`/sprints-management/${sprints[0].projectId}`} variant="contained" color="secondary" size="small">
                    Go to Sprints Management
                </Button>
            </Box>
            {sprints.map((sprint) => (
                <div key={sprint._id}>
                    <Typography variant="subtitle1">{sprint.name}</Typography>
                    <Typography variant="body2">start: {new Date(sprint.startDate).toLocaleDateString()} - end: {new Date(sprint.endDate).toLocaleDateString()}</Typography>
                    <List>
                        {sprint.items?.map((item) => (
                            <ListItem key={item._id}>
                                <ListItemText
                                    primary={item.title}
                                    secondary=
                                    <Box component="span" width={'auto'}>
                                        <Box component="span" display="block" variant="body2" fontWeight="fontWeightMedium">
                                            {item.description}
                                        </Box>
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