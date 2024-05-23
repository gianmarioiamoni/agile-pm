import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Typography, Grid, Paper, Button } from '@mui/material';

import { getBacklogItems, deleteBacklogItem } from "../services/backlogServices";

import BacklogItemForm from "../components/backlog/BacklogItemForm";


export default function BacklogPage() {
    const { projectId } = useParams();
    const [backlogItems, setBacklogItems] = useState([]);

    useEffect(() => {
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
            console.error('Errore durante la cancellazione dell\'item del backlog:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Backlog for Project: {projectId}
            </Typography>
            <BacklogItemForm projectId={projectId} onItemCreated={handleItemCreated} />
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                {backlogItems.map(item => (
                    <Grid item xs={12} key={item._id}>
                        <Paper style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                            </div>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDeleteItem(item._id)}
                            >
                                Delete
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
