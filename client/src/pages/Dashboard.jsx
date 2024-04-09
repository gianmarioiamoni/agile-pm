import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { AddCircle } from '@mui/icons-material';

import { v4 as uuidv4 } from 'uuid';

import Header from "../components/Header"
import ProjectsList from "../components/project/ProjectsList";
import NewProjectForm from "../components/project/NewProjectForm";
import EditProjectDialog from "../components/project/EditProjectDialog";

export default function Dashboard () {
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

        // logic implementation to modify the projecs list with the edited project
        const idx = projects.findIndex((p) => (p.id === editedProject.id));
        const newProjectsList = [...projects];
        newProjectsList[idx] = { ...editedProject };
        setProjects(newProjectsList);
         
        setEditProject(null); // close the dialog after editing
    };

    const handleDeleteProject = () => {
        // Implementa la logica per l'eliminazione del progetto
        const newProjectsList = projects.filter((p) => p.id != deleteProject.id);
        setProjects(newProjectsList);
        setDeleteProject(null); // Chiudi il dialog dopo l'eliminazione
    };


    return (
        <>
            {/* Header */}
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} />

            <div className='px-4, py-12 max-w-2xl mx-auto'>
                <h1 className='text-3xl font-bold mb-4 text-slate-800'>Dashboard</h1>

                {/* Projects area */}
                <div>
                    <Grid container spacing={3}>
                        {/* Add New Project Section */}
                        <Grid item xs={12}>
                            <Typography variant="h5">Add New Project</Typography>
                            <Divider />
                            <NewProjectForm onCreateProject={handleCreateProject} />
                        </Grid>

                        {/* Projects List Section */}
                        <Grid item xs={12}>
                            <Typography variant="h5">Projects List</Typography>
                            <Divider />
                            <ProjectsList
                                projects={projects}
                                onEdit={(project) => setEditProject(project)}
                                onDelete={(project) => setDeleteProject(project)}
                            />
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

                        <Grid item xs={12}>
                            <Typography variant="h5">Statistics</Typography>
                            <Divider />
                            {/* Add any additional components here, e.g., project statistics */}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h5">Settings</Typography>
                            <Divider />
                            {/* Add any additional components here, e.g., user settings */}
                        </Grid>

                        {/* Floating Action Button for Quick Add */}
                        <Grid container justifyContent="flex-end">
                            <AddCircle color="primary" fontSize="large" />
                        </Grid>
                    </Grid>
                </div>

                {/* Modifica Progetto Dialog */}
                <EditProjectDialog
                    open={!!editProject}
                    onClose={() => setEditProject(null)}
                    onEdit={handleEditProject}
                    project={editProject}
                />

                {/* Elimina Progetto Dialog */}
                <Dialog open={!!deleteProject} onClose={() => setDeleteProject(null)}>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Are you sure you want to delete the project: {deleteProject && deleteProject.name}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteProject(null)}>Cancel</Button>
                        <Button onClick={handleDeleteProject} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </>
    );
};


