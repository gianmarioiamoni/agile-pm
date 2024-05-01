// ProjectsList.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Link } from 'react-router-dom';

import { getProjectAssignments } from "../../services/assignmentServices";

export default function ProjectsList({ projects, onEdit, onDelete, isEditable = true, isDeletable = true }) {
    const [projectAssignments, setProjectAssignments] = useState({});

    useEffect(() => {
        const fetchProjectAssignments = async () => {
            const assignments = {};
            for (const project of projects) {
                assignments[project.id] = await getProjectAssignments(project.id);
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
                        <Typography variant="body2">Team Members: {projectAssignments && projectAssignments[project.id]?.map(assignment => assignment.userId.username).join(', ')}</Typography>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                        <Link to={`/team-assignments/${project.id}`}>
                            <IconButton>
                                <VisibilityIcon />
                            </IconButton>
                        </Link>
                        <IconButton onClick={() => onEdit(project)} disabled={!isEditable}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => onDelete(project)} disabled={!isDeletable}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
};


