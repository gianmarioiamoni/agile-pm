import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

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
                    <List>
                        {sprint.items?.map((item) => (
                            <ListItem key={item._id}>
                                <ListItemText
                                    primary={item.title}
                                    secondary={`${item.description} - Status: ${item.status}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            ))}
        </Paper>
    );
}