import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Typography, Grid, Paper, Button, TextField, IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';

import { getBacklogItems, deleteBacklogItem, updateBacklogItem } from "../services/backlogServices";
import { getProject } from "../services/projectServices";
import Header from "../components/Header";
import BacklogItemForm from "../components/backlog/BacklogItemForm";

export default function BacklogPage() {
    const { projectId } = useParams();
    const [projectName, setProjectName] = useState('');
    const [backlogItems, setBacklogItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        const fetchProjectName = async () => {
            try {
                const project = await getProject(projectId);
                setProjectName(project.name);
            } catch (error) {
                console.log("Error while fetching project name:", error);
            }
        };
        fetchProjectName();

        const fetchBacklogItems = async () => {
            try {
                const items = await getBacklogItems(projectId);
                setBacklogItems(items);
            } catch (error) {
                console.log("Error while fetching backlog items:", error);
            }
        };
        fetchBacklogItems();
    }, [projectId]);

    const handleItemCreated = (newItem) => {
        setBacklogItems([...backlogItems, newItem]);
    };

    const handleDeleteItem = async (id) => {
        try {
            await deleteBacklogItem(id);
            setBacklogItems(backlogItems.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error while deleting backlog item:', error);
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setEditedTitle(item.title);
        setEditedDescription(item.description);
    };

    const handleSaveClick = async () => {
        try {
            const updatedItem = await updateBacklogItem(editingItem._id, {
                title: editedTitle,
                description: editedDescription,
            });
            setBacklogItems(backlogItems.map(item => {
                return item._id === editingItem._id ? updatedItem : item;
            }));
            setEditingItem(null);
            setEditedTitle('');
            setEditedDescription('');
        } catch (error) {
            console.error('Error updating backlog item:', error);
        }
    };

    const handleCancelClick = () => {
        setEditingItem(null);
        setEditedTitle('');
        setEditedDescription('');
    };

    const handleMoveUp = (index) => {
        if (index === 0) {
            return;
        }
        const items = [...backlogItems];
        const temp = items[index];
        items[index] = items[index - 1];
        items[index - 1] = temp;
        setBacklogItems(items);
    };

    const handleMoveDown = (index) => {
        if (index === backlogItems.length - 1) {
            return;
        }
        const items = [...backlogItems];
        const temp = items[index];
        items[index] = items[index + 1];
        items[index + 1] = temp;
        setBacklogItems(items);
    };

    return (
        <>
            <Header isShowProfile={true} isShowBack={true} />
        
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Backlog for Project: {projectName}
            </Typography>
            <BacklogItemForm projectId={projectId} onItemCreated={handleItemCreated} />
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                {backlogItems.map((item, index) => (
                    <Grid item xs={12} key={item._id}>
                        <Paper style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            {editingItem && editingItem._id === item._id ? (
                                <div>
                                    <TextField
                                        label="Title"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        fullWidth
                                        style={{ marginBottom: '10px' }}
                                    />
                                    <TextField
                                        label="Description"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        style={{ marginBottom: '10px' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveClick}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleCancelClick}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                                </div>
                            )}
                            <div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleEditItem(item)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeleteItem(item._id)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Delete
                                </Button>
                                <IconButton onClick={() => handleMoveUp(index)} disabled={index === 0}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton onClick={() => handleMoveDown(index)} disabled={index === backlogItems.length - 1}>
                                    <ArrowDownwardIcon />
                                </IconButton>
                            </div>
                        </Paper>
                    </Grid>
                ))}
                </Grid>
            </div>
        </>
    );
}
