import { useState } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { Box, List, ListItem, ListItemText, Typography, IconButton, Tooltip, Grid } from '@mui/material';
import { Edit, Delete, PlaylistAdd } from '@mui/icons-material';

import { toDate } from 'date-fns';

import EditSprintDialog from "./EditSprintDialog";
import { updateSprint, removeSprint } from "../../services/sprintServices";

import SprintAssignmentPage from '../../pages/SprintAssignmentPage';

/**
 * SprintList component renders a list of sprints for a given project.
 * @param {Object} props - Component props
 * @param {string} props.projectId - The id of the project
 * @param {Array} props.sprints - The sprints for the project
 * @param {Function} props.setSprints - A function to update the state with new sprints
 */
export default function SprintList({ projectId, sprints, setSprints, canEditSprint = true, canDeleteSprint = true, canAssignSprint = true }) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentSprint, setCurrentSprint] = useState({
        name: '',
        projectId,
        startDate: toDate(new Date()),
        endDate: toDate(new Date()),
        goal: '',
    });

    const handleEdit = (sprint) => {
        setCurrentSprint(sprint);
        setEditDialogOpen(true);
    };

    const handleSave = async (editedSprint) => {
        try {
            const updatedSprint = await updateSprint(editedSprint);
            setSprints(prevSprints =>
                prevSprints.map(sprint => (sprint._id === editedSprint._id ? updatedSprint : sprint))
            );
        } catch (error) {
            console.error('Error updating sprint:', error);
        }
    };

    const handleDelete = async (sprintId) => {
        try {
            await removeSprint(sprintId);
            setSprints(prevSprints => prevSprints.filter(sprint => sprint._id !== sprintId));
        } catch (error) {
            console.error('Error deleting sprint:', error);
        }
    };

    const handleAssignTasks = async (sprintId) => {
        console.log("assign tasks to sprint: ", sprintId);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Sprints
            </Typography>
            <List>
                {sprints?.map((sprint) => (
                    <ListItem key={sprint._id} divider>
                        <ListItemText
                            width="100%"
                            primary={sprint.name}
                            secondary={
                                <Box component="span" width={'auto'}>
                                    <Box component="span" display="block" fontWeight="fontWeightMedium">
                                        Goal: {sprint.goal}
                                    </Box>
                                    <Box component="span" display="block" color="textSecondary" minWidth="250px">
                                        Start: {new Date(sprint.startDate).toLocaleDateString()} - End: {new Date(sprint.endDate).toLocaleDateString()}
                                    </Box>
                                </Box>
                            }
                        />
                        <Grid container justifyContent="flex-end" alignItems="center">
                            <Tooltip title="Edit Sprint" arrow>
                                <div>
                                    <IconButton disabled={!canEditSprint} onClick={() => handleEdit(sprint)}>
                                        <Edit fontSize='small' />
                                    </IconButton>
                                </div>
                            </Tooltip>
                            <Tooltip title="Delete Sprint" arrow>
                                <div>
                                    <IconButton disabled={!canDeleteSprint} onClick={() => handleDelete(sprint._id)}>
                                        <Delete fontSize='small' />
                                    </IconButton>
                                </div>
                            </Tooltip>
                            <Link to={`/sprint-assignment/${sprint._id}`} style={!canAssignSprint ? { pointerEvents: 'none' } : {}}>
                                <Tooltip title="Assign Tasks" arrow>
                                    <div>
                                        <IconButton disabled={!canAssignSprint}>
                                            <PlaylistAdd fontSize='small' />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Link>
                            
                        </Grid>
                    </ListItem>
                ))}
            </List>

            <EditSprintDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                sprint={currentSprint}
                onSave={handleSave}
            />
        </Box>
    );
}
