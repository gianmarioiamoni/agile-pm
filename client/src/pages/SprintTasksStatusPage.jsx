import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';

import Header from "../components/Header";
import BacklogItem from "../components/sprint/BacklogItem";

import { getSprint } from "../services/sprintServices";
import { updateTaskStatus, getTasksByBacklogItemId } from "../services/taskServices";
import { getBacklogItem } from "../services/backlogServices";
import { getAssignments } from "../services/assignmentServices"; 

/**
 * Component for managing tasks for a specific sprint.
 * Displays all tasks associated with a sprint and allows users to drag and drop tasks to a different backlog item.
 */
export default function SprintTasksStatusPage() {
    // Get sprintId from URL parameters
    const { sprintId } = useParams();

    // State variables
    const [sprint, setSprint] = useState(null); // Sprint data
    const [backlogItems, setBacklogItems] = useState([]); // Backlog items for the sprint
    const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' }); // New task to be added
    const [assignments, setAssignments] = useState([]); // Assignments for the sprint's project

    /**
     * Fetch sprint and assignments data when component mounts.
     */
    useEffect(() => {
        const fetchSprintAndAssignments = async () => {
            try {
                // Fetch sprint data
                const sprintData = await getSprint(sprintId);
                setSprint(sprintData);

                // Fetch backlog items for the sprint
                if (sprintData.items && sprintData.items.length > 0) {
                    const itemPromises = sprintData.items.map(async (item) => {
                        const itemId = item._id || item;
                        const itemData = await getBacklogItem(itemId);
                        const tasks = await getTasksByBacklogItemId(itemId);
                        itemData.tasks = tasks;
                        return itemData;
                    });

                    const itemsData = await Promise.all(itemPromises);
                    setBacklogItems(itemsData);
                } else {
                    console.log('SprintTasksPage: fetchSprint: No items found in sprintData');
                }

                // Fetch assignments for the sprint's project
                if (sprintData.projectId) {
                    const assignmentsData = await getAssignments(sprintData.projectId);
                    setAssignments(assignmentsData);
                    setNewTask({ title: '', description: '', assignee: '' });
                }

            } catch (error) {
                console.error('Error fetching sprint and assignments:', error);
            }
        };

        fetchSprintAndAssignments();
    }, [sprintId]);

    /**
     * Handle drag end event for reordering tasks.
     * Updates the task status and state variables.
     * @param {Object} result - Result of the drag end event
     */
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

        await updateTaskStatus(movedTask._id, sourceItem, destinationDroppableId);
    };

    /**
     * Check if the "Add Task" button should be disabled based on the input values.
     * @returns {boolean} - True if the "Add Task" button should be disabled, false otherwise.
     */
    const isAddTaskDisabled = newTask.title.trim() === '' || newTask.description.trim() === '';


    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowDashboard={true} isShowBack={true}/>

            <Container style={{ marginTop: 20 }}>
                {/* Display sprint name */}
                <Typography variant="h4" gutterBottom>
                    Manage Tasks for Sprint <Box component="span" color="primary.main" fontWeight="fontWeightBold">{sprint ? sprint.name : ''}</Box>
                </Typography>

                {/* Display backlog items with draggable tasks */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    {backlogItems?.map(item => (
                        <BacklogItem
                            key={item._id} // unique key for list element
                            item={item}
                            backlogItems={backlogItems}
                            setBacklogItems={setBacklogItems}
                            assignments={assignments}
                        />
                    ))}
                </DragDropContext>
            </Container>
        </>
    );
}


