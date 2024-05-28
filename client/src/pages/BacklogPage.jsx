import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Paper, Button, TextField, IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Importa i componenti necessari

import { getBacklogItems, deleteBacklogItem, updateBacklogItem, updatePriorities } from "../services/backlogServices";
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
                items.sort((a, b) => a.priority - b.priority);
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

    const updateBackendPriorities = async (updatedItems) => {
        // Create an array of objects for the updated priorities
        const updatedPriorities = updatedItems.map((item, index) => ({ id: item._id, priority: index }));

        // Send request to backend to update priorities
        // updatedPriorities array contains the new priority values
        try {
            await updatePriorities(projectId, updatedPriorities);
        } catch (error) {
            console.error('Error updating backlog priorities:', error);
            // implement rollback here in case of failure
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedItems = Array.from(backlogItems);
        const movedItem = reorderedItems.splice(result.source.index, 1)[0];
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setBacklogItems(reorderedItems);

        updateBackendPriorities(reorderedItems);

        // // Create an array of objects for the updated priorities
        // const updatedPriorities = reorderedItems.map((item, index) => ({ id: item._id, priority: index }));

        // // Send request to backend to update priorities
        // // updatedPriorities array contains the new priority values
        // try {
        //     await updatePriorities(projectId, updatedPriorities);
        // } catch (error) {
        //     console.error('Error updating backlog priorities:', error);
        //     // implement rollback here in case of failure
        // }
    };

    const handleMoveDown = async (itemId) => {
        console.log('handleMoveDown called with item id:', itemId);
        console.log('backlogItems:', backlogItems);
        const currentItemIndex = backlogItems.findIndex(item => item._id === itemId);
        console.log('currentItemIndex:', currentItemIndex);
        if (currentItemIndex !== backlogItems.length - 1) {
            const nextItem = backlogItems[currentItemIndex + 1];
            const currentItem = backlogItems[currentItemIndex];
            console.log('nextItem:', nextItem);
            console.log('currentItem:', currentItem);
            const updatedItems = [...backlogItems];
            updatedItems[currentItemIndex] = nextItem;
            updatedItems[currentItemIndex + 1] = currentItem;
            console.log('updatedItems:', updatedItems);
            setBacklogItems(updatedItems);

            updateBackendPriorities(updatedItems);

            // // Create an array of objects for the updated priorities
            // const updatedPriorities = updatedItems.map((item, index) => ({ id: item._id, priority: index }));

            // // Send request to backend to update priorities
            // // updatedPriorities array contains the new priority values
            // try {
            //     await updatePriorities(projectId, updatedPriorities);
            // } catch (error) {
            //     console.error('Error updating backlog priorities:', error);
            //     // implement rollback here in case of failure
            // }
        }
    };

    const handleMoveUp = async (itemId) => {
        const currentItemIndex = backlogItems.findIndex(item => item._id === itemId);
        if (currentItemIndex !== 0) {
            const previousItem = backlogItems[currentItemIndex - 1];
            const currentItem = backlogItems[currentItemIndex];
            const updatedItems = [...backlogItems];
            updatedItems[currentItemIndex] = previousItem;
            updatedItems[currentItemIndex - 1] = currentItem;
            setBacklogItems(updatedItems);

            updateBackendPriorities(updatedItems);
        }
    };


    return (
        <>
            <Header isShowProfile={true} isShowBack={true} />

            <div style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Backlog for Project: {projectName}
                </Typography>
                <BacklogItemForm projectId={projectId} onItemCreated={handleItemCreated} />
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="backlogItems">
                        {(provided) => (
                            <Grid container spacing={3} style={{ marginTop: '20px' }} ref={provided.innerRef}>
                                {backlogItems.map((item, index) => (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
                                        {(provided) => (
                                            <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                                        <IconButton onClick={() => handleMoveUp(item._id)} disabled={index === 0}>
                                                            <ArrowUpwardIcon />
                                                        </IconButton>
                                                        
                                                    <IconButton onClick={() => handleMoveDown(item._id)} disabled={index === backlogItems.length - 1}>
                                                        <ArrowDownwardIcon />
                                                    </IconButton>
                                                    </div>
                                                </Paper>
                                                {provided.placeholder}
                                            </Grid>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Grid>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    )
}
