import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

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
                            secondary={`${item.description} - Goal: ${item.goal}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};