import React, { useState } from 'react';

import { TextField, Button } from '@mui/material';

import { createBacklogItem } from "../../services/backlogServices";

/**
 * BacklogItemForm component for creating a new backlog item.
 * @param {Object} props - The component props.
 * @param {string} props.projectId - The ID of the project the backlog item belongs to.
 * @param {function} props.onItemCreated - The callback function to be called when a new backlog item is created.
 * @returns {JSX.Element} The rendered BacklogItemForm component.
 */
export default function BacklogItemForm({ projectId, onItemCreated }) {
    // State variables for the title and description of the backlog item
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    /**
     * Handles the form submission for creating a new backlog item.
     * @param {Event} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Create a new backlog item using the provided project ID, title, and description
            const newItem = await createBacklogItem({ projectId, title, description });
            // Call the onItemCreated callback function with the newly created backlog item
            onItemCreated(newItem);
            // Reset the title and description state variables
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error creating backlog item:', error);
        }
    };

    return (
        // Render the form for creating a new backlog item
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
