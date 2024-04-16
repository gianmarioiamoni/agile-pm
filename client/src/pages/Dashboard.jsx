import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import Header from "../components/Header"
import ProjectsList from "../components/project/ProjectsList";
import NewProjectForm from "../components/project/NewProjectForm";
import EditProjectDialog from "../components/project/EditProjectDialog";

import {
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canViewProject
} from "../Authorizations";

import { getAllProjects, createProject, updateProject, removeProject } from "../services/projectServices";

export default function Dashboard() {
    const { currentUser } = useSelector(state => state.user);
    // const [projects, setProjects] = useState([
    //     { id: uuidv4(), name: 'Project 1', description: 'Description of Project 1' },
    //     { id: uuidv4(), name: 'Project 2', description: 'Description of Project 2' },
    //     // Add more dummy projects as needed
    // ]);
    const [projects, setProjects] = useState([]);
    const [editProject, setEditProject] = useState(null);
    const [deleteProject, setDeleteProject] = useState(null);

    // useEffects
    useEffect(() => {
        const getProjects = async () => {
            const projectsListFromDB = await getAllProjects();
            const projectsList = projectsListFromDB.map((p) => ({ ...p, id: p._id }));

            setProjects(projectsList);
        }
        getProjects();
        
    }, []);

    // callbacks for event handling
    const handleCreateProject = (newProject) => {
        const createdProject = createProject(newProject)
        setProjects([...projects, { ...newProject }]);
    };

    const handleEditProject = (editedProject) => {
        updateProject(editedProject);

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
        removeProject(deleteProject.id);
        setDeleteProject(null);
    };

    return (
        <>
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} />
            <div style={{ padding: '24px' }}>
                <Typography variant="h3" gutterBottom>Dashboard</Typography>

                {/* <Grid container spacing={3} alignItems="center"> */}
                <Grid container spacing={3} alignItems="flex-start">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={!canCreateProject(currentUser) ? { color: "gray" } : {}}>Add New Project</Typography>
                        <Divider />
                        <NewProjectForm
                            onCreateProject={handleCreateProject}
                            isCreable={canCreateProject(currentUser)} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <div style={{ maxHeight: '70vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                            <Typography variant="h5">Projects List</Typography>
                            <Divider />
                            <ProjectsList
                                projects={projects}
                                onEdit={(project) => canEditProject(currentUser) && setEditProject(project)}
                                onDelete={(project) => canDeleteProject(currentUser) && setDeleteProject(project)}
                                isEditable={canEditProject(currentUser)}
                                isDeletable={canDeleteProject((currentUser))}
                            />
                        </div>
                    </Grid>

                    {/* Other additional components */}
                    {/* (Ometti i componenti non accessibili per utenti non autorizzati) */}
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
