import React, { useState } from 'react';

import { TextField, Button } from '@mui/material';

import { createBacklogItem } from "../../services/backlogServices";

export default function BacklogItemForm({ projectId, onItemCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newItem = await createBacklogItem({ projectId, title, description });
            onItemCreated(newItem);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error creating backlog item:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />
            <Button type="submit" variant="contained" color="primary">
                Create Backlog Item
            </Button>
        </form>
    );
}
