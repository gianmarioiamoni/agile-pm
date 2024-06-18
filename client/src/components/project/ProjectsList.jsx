import React, { useState, useEffect } from 'react';

import { Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Assignment, Dashboard } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewTimeLineIcon from '@mui/icons-material/ViewTimeline';

import { Link } from 'react-router-dom';

import { getAssignments } from "../../services/assignmentServices";

/**
 * ProjectsList component displays the list of projects with their details.
 * It provides options to manage team assignments, manage sprints, view project backlog,
 * edit and delete projects.
 *
 * @param {Array} projects - Array of project objects
 * @param {Function} onEdit - Function to handle project edit event
 * @param {Function} onDelete - Function to handle project delete event
 * @param {boolean} canEditProject - Flag to indicate if user can edit project
 * @param {boolean} canDeleteProject - Flag to indicate if user can delete project
 * @param {boolean} canAllocateProject - Flag to indicate if user can allocate project
 * @param {boolean} canManageSprints - Flag to indicate if user can manage sprints
 */
export default function ProjectsList({ projects, onEdit, onDelete,
    canEditProject = true, canDeleteProject = true, canAllocateProject = true,
    canManageSprints = true }) {
    
    // State to store project assignments
    const [projectAssignments, setProjectAssignments] = useState({});

    // Fetch project assignments on component mount and whenever projects array changes
    useEffect(() => {
        const fetchProjectAssignments = async () => {
            const assignments = {};
            for (const project of projects) {
                assignments[project.id] = await getAssignments(project.id);
            }
            setProjectAssignments(assignments);
        };
        fetchProjectAssignments();
        console.log(projects)
    }, [projects]);

    return (
        <div>
            {/* Map through projects array and display project details */}
            {projects != null && projects.map(project => (
                <Grid container key={project.id} spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        {/* Project name */}
                        <Typography variant="subtitle1">{project.name}</Typography>
                        {/* Project description */}
                        <Typography variant="body2">{project.description}</Typography>
                        {/* Display team member names */}
                        <Typography variant="body2">
                            Team Members: {projectAssignments && projectAssignments[project.id]?.map(assignment => assignment.username).join(', ')}
                        </Typography>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                        {/* Link to manage team assignments */}
                        <Link to={`/team-assignments/${project.id}`} style={!canAllocateProject ? { pointerEvents: 'none' } : {}}>
                            <Tooltip title="Manage Team Assignments" arrow>
                                <div>
                                    <IconButton disabled={!canAllocateProject}>
                                        <GroupsIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        {/* Link to manage sprints */}
                        <Link to={`/sprints-management/${project.id}`} style={!canManageSprints ? { pointerEvents: 'none' } : {}}>
                            <Tooltip title="Manage Sprints" arrow>
                                <div>
                                    <IconButton disabled={!canManageSprints}>
                                        <ViewTimeLineIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        {/* Link to view project backlog */}
                        <Link to={`/project/${project.id}/backlog`} >
                            <Tooltip title="Backlog" arrow>
                                <div>
                                    <IconButton >
                                        <Assignment />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        {/* Button to edit project */}
                        <Tooltip title="Edit Project" arrow>
                            <div>
                                <IconButton onClick={() => onEdit(project)} disabled={!canEditProject}>
                                    <Edit />
                                </IconButton>
                            </div>
                        </Tooltip>
                        {/* Button to delete project */}
                        <Tooltip title="Delete Project" arrow>
                            <div>
                                <IconButton onClick={() => onDelete(project)} disabled={!canDeleteProject}>
                                    <Delete />
                                </IconButton>
                            </div>
                        </Tooltip>
                        {/* Link to project dashboard */}
                        <Link to={`/project-dashboard/${project.id}`} >
                            <Tooltip title="Project Dashboard" arrow>
                                <div>
                                    <IconButton >
                                        <Dashboard color='secondary' />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
};


