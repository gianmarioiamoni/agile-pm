// components/SprintList.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';



/**
 * SprintList component renders a list of sprints for a given project.
 * @param {Object} props - Component props
 * @param {string} props.projectId - The id of the project
 * @param {Array} props.sprints - The sprints for the project
 * @param {Function} props.setSprints - A function to update the state with new sprints
 */
export default function SprintList ({ projectId, sprints, setSprints }) {

    /**
     * useEffect is used to fetch sprints when the component mounts.
     * The effect is only triggered when the projectId changes.
     */
    // useEffect(() => {
    //     /**
    //      * Fetchs the sprints for the given project from the server.
    //      * The response is then set as the state of the sprints.
    //      */
    //     const fetchSprints = async () => {
    //         try {
    //             const response = await axios.get(`/server/sprints/${projectId}`);
    //             setSprints(response.data);
    //         } catch (error) {
    //             console.error('Error fetching sprints:', error);
    //         }
    //     };

    //     // Fetch sprints only if they haven't already been fetched
    //     if (!sprints || sprints.length === 0) {
    //         fetchSprints();
    //     }
    // }, [projectId]);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Sprints
            </Typography>
            <List>
                {/**
                 * Maps over the sprints array and renders a list item for each sprint
                 * The list item contains the name, goal and start/end dates of the sprint
                 */}
                {sprints?.map((sprint) => (
                    <ListItem key={sprint._id} divider>
                        <ListItemText
                            primary={sprint.name}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        Goal: {sprint.goal}
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2" color="textSecondary">
                                        Start: {new Date(sprint.startDate).toLocaleDateString()} - End: {new Date(sprint.endDate).toLocaleDateString()}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

