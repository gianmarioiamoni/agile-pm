import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewTimeLineIcon from '@mui/icons-material/ViewTimeline';
import { Link } from 'react-router-dom';
import { getAssignments } from "../../services/assignmentServices";

export default function ProjectsList({ projects, onEdit, onDelete, isEditable = true, isDeletable = true, isAllocable = true }) {
    const [projectAssignments, setProjectAssignments] = useState({});

    useEffect(() => {
        const fetchProjectAssignments = async () => {
            const assignments = {};
            for (const project of projects) {
                assignments[project.id] = await getAssignments(project.id);
            }
            setProjectAssignments(assignments);
            console.log("assignments: ", assignments)
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
                        <Link to={`/team-assignments/${project.id}`} style={!isAllocable ? { pointerEvents: 'none' } : {}}>
                            <Tooltip title="Manage Team Assignments" arrow>
                                <div>
                                    <IconButton disabled={!isAllocable}>
                                        <GroupsIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        <Link to={`/sprints-management/${project.id}`} style={!isAllocable ? { pointerEvents: 'none' } : {}}>
                            <Tooltip title="Manage Sprints" arrow>
                                <div>
                                    <IconButton>
                                        <ViewTimeLineIcon />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Link>
                        <Tooltip title="Edit Project" arrow>
                            <div>
                                <IconButton onClick={() => onEdit(project)} disabled={!isEditable}>
                                    <Edit />
                                </IconButton>
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete Project" arrow>
                            <div>
                                <IconButton onClick={() => onDelete(project)} disabled={!isDeletable}>
                                    <Delete />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
};


