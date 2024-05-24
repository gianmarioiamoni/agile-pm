import React, { useState, useEffect } from 'react';

import { Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Assignment, Dashboard } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewTimeLineIcon from '@mui/icons-material/ViewTimeline';

import { Link } from 'react-router-dom';

import { getAssignments } from "../../services/assignmentServices";

export default function ProjectsList({ projects, onEdit, onDelete,
    canEditProject = true, canDeleteProject = true, canAllocateProject = true,
    canManageSprints = true }) {
    
    const [projectAssignments, setProjectAssignments] = useState({});

    useEffect(() => {
        const fetchProjectAssignments = async () => {
            const assignments = {};
            for (const project of projects) {
                assignments[project.id] = await getAssignments(project.id);
            }
            setProjectAssignments(assignments);
        };
        fetchProjectAssignments();
    }, [projects]);

    return (
        <div>
            {projects != null && projects.map(project => (
                <Grid container key={project.id} spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        <Typography variant="subtitle1">{project.name}</Typography>
                        <Typography variant="body2">{project.description}</Typography>
                        {/* Team member names preview */}
                        <Typography variant="body2">Team Members: {projectAssignments && projectAssignments[project.id]?.map(assignment => assignment.username).join(', ')}</Typography>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                        <Link to={`/team-assignments/${project.id}`} style={!canAllocateProject ? { pointerEvents: 'none' } : {}}>
                            <Tooltip title="Manage Team Assignments" arrow>
                                <div>
                                    <IconButton disabled={!canAllocateProject}>
                                        <GroupsIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        <Link to={`/sprints-management/${project.id}`} style={!canManageSprints ? { pointerEvents: 'none' } : {}}>
                            <Tooltip title="Manage Sprints" arrow>
                                <div>
                                    <IconButton disabled={!canManageSprints}>
                                        <ViewTimeLineIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        <Link to={`/project/${project.id}/backlog`} >
                            <Tooltip title="Backlog" arrow>
                                <div>
                                    <IconButton >
                                        <Assignment />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        <Tooltip title="Edit Project" arrow>
                            <div>
                                <IconButton onClick={() => onEdit(project)} disabled={!canEditProject}>
                                    <Edit />
                                </IconButton>
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete Project" arrow>
                            <div>
                                <IconButton onClick={() => onDelete(project)} disabled={!canDeleteProject}>
                                    <Delete />
                                </IconButton>
                            </div>
                        </Tooltip>
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


