import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

import { getProject } from "../services/projectServices";
import { getAssignments } from "../services/assignmentServices";
import { getBacklogItems } from "../services/backlogServices";
import { getSprintsByProjectId } from "../services/sprintServices";


export default function ProjectDashboardPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState({});
    const [resources, setResources] = useState([]);
    const [backlogItems, setBacklogItems] = useState([]);
    const [sprints, setSprints] = useState([]);

    useEffect(() => {
        const fetchProjectData = async () => {
            const projectDetails = await getProject(projectId);
            const projectResources = await getAssignments(projectId);
            const projectBacklog = await getBacklogItems(projectId);
            const projectSprints = await getSprintsByProjectId(projectId);

            setProject(projectDetails);
            setResources(projectResources);
            setBacklogItems(projectBacklog);
            setSprints(projectSprints);
        };

        fetchProjectData();
    }, [projectId]);

    return (
        <Container>
            <Typography variant="h3" gutterBottom>Project Dashboard</Typography>

            {/* Project Information */}
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h5">Project Information</Typography>
                <Typography variant="subtitle1">{project.name}</Typography>
                <Typography variant="body1">{project.description}</Typography>
            </Paper>

            {/* Resources */}
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h5">Resources</Typography>
                <List>
                    {resources.map(resource => (
                        <ListItem key={resource._id}>
                            <ListItemText primary={`${resource.username}`} secondary={`${resource.role.roleDescription}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Backlog */}
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h5">Backlog</Typography>
                <List>
                    {backlogItems.map(item => (
                        <ListItem key={item._id}>
                            <ListItemText primary={item.title} secondary={item.description} />
                            <Typography variant="body2">{item.status}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Sprint Log */}
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h5">Sprint Log</Typography>
                <List>
                    {sprints.map(sprint => (
                        <ListItem key={sprint._id}>
                            <ListItemText primary={`Sprint ${sprint.name}: ${sprint.startDate} - ${sprint.endDate}`} secondary={`goal: ${sprint.goal}`} />
                            <List>
                                {sprint.tasks.map(task => (
                                    <ListItem key={task._id}>
                                        <ListItemText primary={task.title} secondary={task.status} />
                                    </ListItem>
                                ))}
                            </List>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Statistics */}
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h5">Statistics</Typography>
                {/* Add charts and statistics here */}
            </Paper>
        </Container>
    );
}
