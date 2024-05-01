import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

import Header from "../components/Header"
import ProjectsList from "../components/project/ProjectsList";
import NewProjectForm from "../components/project/NewProjectForm";
import EditProjectDialog from "../components/project/EditProjectDialog";

import { getAllProjects, createProject, updateProject, removeProject } from "../services/projectServices";
import { canCreateProject, canViewProject, canEditProject, canDeleteProject } from "../services/rolesMapServices";

export default function Dashboard({projects, setProjects}) {
    const { currentUser } = useSelector(state => state.user);
    // const [projects, setProjects] = useState([]);
    const [editProject, setEditProject] = useState(null);
    const [deleteProject, setDeleteProject] = useState(null);

    const [canProjects, setCanProjects] = useState({
        create: false,
        edit: false,
        delete: false,
        view: false
    });

    // useEffects
    useEffect(() => {

        const checkPermissions = async () => {
            // get Projects permissions
            const createProject = await canCreateProject(currentUser);
            const editProject = await canEditProject(currentUser);
            const deleteProject = await canDeleteProject(currentUser);
            const viewProject = await canViewProject(currentUser);

            setCanProjects((prev) => ({
                ...prev,
                create: createProject,
                edit: editProject,
                delete: deleteProject,
                view: viewProject
            }));
        }
        checkPermissions();

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
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} isShowAdmin={currentUser.role === 0} />
            <div style={{ padding: '24px' }}>
                <Typography variant="h3" gutterBottom>Dashboard</Typography>

                <Grid container spacing={3} alignItems="flex-start">

                    {/* New Projects form */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={!canProjects.create ? { color: "gray" } : {}}>Add New Project</Typography>
                        <Divider />
                        <NewProjectForm
                            onCreateProject={handleCreateProject}
                            isCreable={canProjects.create} />
                    </Grid>

                    {/* Projects List */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Projects List</Typography>
                        <Divider />
                        <div style={{ maxHeight: '70vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                            <ProjectsList
                                projects={projects}
                                onEdit={(project) => canProjects.edit && setEditProject(project)}
                                onDelete={(project) => canProjects.delete && setDeleteProject(project)}
                                isEditable={canProjects.edit}
                                isDeletable={canProjects.delete}
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
