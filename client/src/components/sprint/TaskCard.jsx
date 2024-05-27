import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

export default function TaskCard({ task }) {
    return (
        <Card variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{task.content}</Typography>
                <Chip label={task.status} color={task.status === 'Done' ? 'success' : 'default'} />
            </CardContent>
        </Card>
    );
}
