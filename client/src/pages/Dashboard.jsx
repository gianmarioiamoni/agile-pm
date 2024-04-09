import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import Header from "../components/Header"
import ProjectsList from "../components/project/ProjectsList";
import NewProjectForm from "../components/project/NewProjectForm";
import EditProjectDialog from "../components/project/EditProjectDialog";

export default function Dashboard() {
    const { currentUser } = useSelector(state => state.user);

    const [projects, setProjects] = useState([
        { id: uuidv4(), name: 'Project 1', description: 'Description of Project 1' },
        { id: uuidv4(), name: 'Project 2', description: 'Description of Project 2' },
        // Add more dummy projects as needed
    ]);

    const [editProject, setEditProject] = useState(null);
    const [deleteProject, setDeleteProject] = useState(null);

    const handleCreateProject = (newProject) => {
        setProjects([...projects, { id: uuidv4(), ...newProject }]);
    };

    const handleEditProject = (editedProject) => {
        const updatedProjects = projects.map(project =>
            project.id === editedProject.id ? editedProject : project
        );
        setProjects(updatedProjects);
        setEditProject(null);
    };

    const handleDeleteProject = () => {
        const updatedProjects = projects.filter(project =>
            project.id !== deleteProject.id
        );
        setProjects(updatedProjects);
        setDeleteProject(null);
    };

    return (
        <>
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} />
            <div style={{ padding: '24px' }}>
                <Typography variant="h3" gutterBottom>Dashboard</Typography>

                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Add New Project</Typography>
                        <Divider />
                        <NewProjectForm onCreateProject={handleCreateProject} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <div style={{ maxHeight: '70vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                            <Typography variant="h5">Projects List</Typography>
                            <Divider />
                            <ProjectsList
                                projects={projects}
                                onEdit={(project) => setEditProject(project)}
                                onDelete={(project) => setDeleteProject(project)}
                            />
                        </div>
                    </Grid>

                    {/* Additional Components */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Recent Activity</Typography>
                        <Divider />
                        {/* Add any additional components here, e.g., recent activity */}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Team Members</Typography>
                        <Divider />
                        {/* Add any additional components here, e.g., team members */}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Statistics</Typography>
                        <Divider />
                        {/* Add any additional components here, e.g., project statistics */}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Settings</Typography>
                        <Divider />
                        {/* Add any additional components here, e.g., user settings */}
                    </Grid>

                    {/* Floating Action Button for Quick Add */}
                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <IconButton color="primary" onClick={() => setEditProject({ id: uuidv4(), name: '', description: '' })}>
                            <AddCircle />
                        </IconButton>
                    </Grid>
                </Grid>

                {/* Edit Project Dialog */}
                <EditProjectDialog
                    open={!!editProject}
                    onClose={() => setEditProject(null)}
                    onEdit={handleEditProject}
                    project={editProject}
                />

                {/* Delete Project Dialog */}
                <Dialog open={!!deleteProject} onClose={() => setDeleteProject(null)}>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Are you sure you want to delete the project: {deleteProject && deleteProject.name}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteProject(null)} color="primary">Cancel</Button>
                        <Button onClick={handleDeleteProject} color="error" startIcon={<Delete />}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
