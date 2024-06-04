import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

import { toDate } from 'date-fns';

export default function SprintBacklog({ sprints }) {

    if (!sprints) {
        return null;
    }


    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">Sprint Backlog</Typography>
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