import React, { useState } from 'react';
import { Button, TextField, Typography, List, ListItem, ListItemText, Checkbox, ListItemSecondaryAction } from '@mui/material';
import { addSprint } from '../../services/sprintServices';

export default function AddSprint({ projectId, sprints, setSprints, canCreateSprint, backlogItems }) {
    const [newSprintName, setNewSprintName] = useState('');
    const [newSprintStartDate, setNewSprintStartDate] = useState('');
    const [newSprintEndDate, setNewSprintEndDate] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);


    const handleCreateSprint = async () => {
        const newSprint = {
            name: newSprintName,
            projectId: projectId,
            startDate: newSprintStartDate,
            endDate: newSprintEndDate,
            items: selectedItems
        };

        try {
            const createdSprint = await addSprint(newSprint);
            setSprints([...sprints, createdSprint]);
            setNewSprintName('');
            setNewSprintStartDate('');
            setNewSprintEndDate('');
            setSelectedItems([]);
        } catch (error) {
            console.error('Error while creating sprint:', error);
        }
    };

    const handleToggleItem = (itemId) => {
        const currentIndex = selectedItems.indexOf(itemId);
        const newSelectedItems = [...selectedItems];

        if (currentIndex === -1) {
            newSelectedItems.push(itemId);
        } else {
            newSelectedItems.splice(currentIndex, 1);
        }

        setSelectedItems(newSelectedItems);
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Create New Sprint
            </Typography>
            <TextField
                label="Sprint Name"
                value={newSprintName}
                onChange={(e) => setNewSprintName(e.target.value)}
                fullWidth
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Start Date"
                type="date"
                value={newSprintStartDate}
                onChange={(e) => setNewSprintStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="End Date"
                type="date"
                value={newSprintEndDate}
                onChange={(e) => setNewSprintEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                style={{ marginBottom: '10px' }}
            />
            {backlogItems && backlogItems.length > 0 ? (
                <>
                    <Typography variant="h6" gutterBottom>
                        Assign Backlog Items
                    </Typography>
                    <List>
                        {backlogItems.map((item) => (
                            <ListItem key={item._id} button onClick={() => handleToggleItem(item._id)}>
                                <ListItemText primary={item.title} secondary={item.description} />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        onChange={() => handleToggleItem(item._id)}
                                        checked={selectedItems.indexOf(item._id) !== -1}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                <Typography variant="body1" gutterBottom>
                    No unassigned backlog items available for this project
                </Typography>
            )}
            {/* <Button variant="contained" color="primary" onClick={handleCreateSprint} disabled={!canCreateSprint}> */}
            <Button variant="contained" color="primary" onClick={handleCreateSprint} >
                Create Sprint
            </Button>
        </div>
    );
}


