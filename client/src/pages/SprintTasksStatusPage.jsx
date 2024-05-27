import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, Box, Container, Card, CardContent } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Header from "../components/Header";
import TaskCard from "../components/task/TaskCard";
import { getSprint } from "../services/sprintServices";
import { updateTaskStatus } from "../services/taskServices";
import { getBacklogItem, updateBacklogItem } from "../services/backlogServices";

/**
 * Page for managing tasks within a sprint.
 */
export default function SprintTasksPage() {
    const { sprintId } = useParams();
    const [sprint, setSprint] = useState(null);
    const [backlogItems, setBacklogItems] = useState([]);

    useEffect(() => {
        const fetchSprint = async () => {
            try {
                const sprintData = await getSprint(sprintId);
                setSprint(sprintData);
                const itemPromises = sprintData.items.map(itemId => getBacklogItem(itemId));
                const itemsData = await Promise.all(itemPromises);
                console.log('SprintTasksPage: fetchSprint: itemsData:', itemsData);
                setBacklogItems(itemsData);
            } catch (error) {
                console.error('Error fetching sprint:', error);
            }
        };

        fetchSprint();
    }, [sprintId]);

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        const sourceDroppableId = result.source.droppableId;
        const destinationDroppableId = result.destination.droppableId;

        if (sourceDroppableId === destinationDroppableId && sourceIndex === destinationIndex) {
            return;
        }

        const updatedBacklogItems = [...backlogItems];
        const sourceItemIndex = updatedBacklogItems.findIndex(item => item._id === sourceDroppableId);
        const destinationItemIndex = updatedBacklogItems.findIndex(item => item._id === destinationDroppableId);

        const sourceItem = updatedBacklogItems[sourceItemIndex];
        const [movedTask] = sourceItem.tasks.splice(sourceIndex, 1);

        if (sourceItemIndex === destinationItemIndex) {
            sourceItem.tasks.splice(destinationIndex, 0, movedTask);
        } else {
            const destinationItem = updatedBacklogItems[destinationItemIndex];
            destinationItem.tasks.splice(destinationIndex, 0, movedTask);
        }

        setBacklogItems(updatedBacklogItems);

        // Update task status and item state in backend
        await updateTaskStatus(movedTask._id, destinationDroppableId);
        await updateBacklogItemState(sourceItem);
        if (sourceItemIndex !== destinationItemIndex) {
            await updateBacklogItemState(updatedBacklogItems[destinationItemIndex]);
        }
    };

    const updateBacklogItemState = async (backlogItem) => {
        const totalTasks = backlogItem.tasks.length;
        const doneTasks = backlogItem.tasks.filter(task => task.status === 'Done').length;

        let newStatus = 'To Do';
        if (doneTasks === totalTasks) {
            newStatus = 'Done';
        } else if (doneTasks > 0) {
            newStatus = 'In Progress';
        }

        if (backlogItem.status !== newStatus) {
            backlogItem.status = newStatus;
            // Assume updateBacklogItem is a service that updates the backlog item in the backend
            await updateBacklogItem(backlogItem._id, { status: newStatus });
        }
    };

    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} />

            <Container style={{ marginTop: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Tasks for Sprint {sprint ? sprint.name : ''}
                </Typography>

                <DragDropContext onDragEnd={handleDragEnd}>
                    {backlogItems?.map(item => (
                        <Droppable droppableId={item._id} key={item._id}>
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{ marginBottom: 2 }}
                                >
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                                        </CardContent>
                                    </Card>
                                    <Grid container spacing={2}>
                                        {item.tasks.map((task, index) => (
                                            <Draggable draggableId={task._id} index={index} key={task._id}>
                                                {(provided) => (
                                                    <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <TaskCard task={task} />
                                                    </Grid>
                                                )}
                                            </Draggable>
                                        ))}
                                    </Grid>
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </Container>
        </>
    );
}
