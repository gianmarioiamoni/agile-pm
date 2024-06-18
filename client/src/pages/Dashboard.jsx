import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Grid, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete } from '@mui/icons-material';

import Header from "../components/Header"
import ProjectsList from "../components/project/ProjectsList";
import NewProjectForm from "../components/project/NewProjectForm";
import EditProjectDialog from "../components/project/EditProjectDialog";

import { createProject, updateProject, removeProject } from "../services/projectServices";
import {
    canCreateProject, canViewProject, canEditProject, canDeleteProject, canAllocateProject,
    canMonitorSprint, canEditSprint, canDeleteSprint, canCreateSprint, canParticipateSprint
 } from "../services/rolesMapServices";

/**
 * Dashboard component displays projects list and allows user to add new project.
 * User can edit and delete projects if they have necessary permissions.
 * 
 * @param {Object} props - Props passed to the component
 * @param {Array} props.projects - Array of projects
 * @param {Function} props.setProjects - Function to update projects
 * @param {Array} props.users - Array of users
 * @param {Object} props.canSprints - Object with permissions for sprints management
 * @param {Function} props.setCanSprints - Function to update sprints permissions
 * @returns {ReactElement} The Dashboard component
 */
export default function Dashboard({projects, setProjects, users, canSprints, setCanSprints}) {
    // Get current user from Redux store
    const { currentUser } = useSelector(state => state.user);
    // State for project to be edited and deleted
    const [editProject, setEditProject] = useState(null);
    const [deleteProject, setDeleteProject] = useState(null);

    // State for project permissions
    const [canProjects, setCanProjects] = useState({
        create: false,
        edit: false,
        delete: false,
        view: false
    });

    // Fetch project permissions on component mount
    useEffect(() => {
        const checkPermissions = async () => {
            // get Projects permissions
            const createProject = await canCreateProject(currentUser);
            const editProject = await canEditProject(currentUser);
            const deleteProject = await canDeleteProject(currentUser);
            const viewProject = await canViewProject(currentUser);
            const allocateProject = await canAllocateProject(currentUser);

            // set Projects permissions
            setCanProjects((prev) => ({
                ...prev,
                create: createProject,
                edit: editProject,
                delete: deleteProject,
                view: viewProject,
                allocate: allocateProject
            }));

            // get Sprints permissions
            const createSprint = await canCreateSprint(currentUser);
            const editSprint = await canEditSprint(currentUser);
            const monitorSprint = await canMonitorSprint(currentUser);
            const deleteSprint = await canDeleteSprint(currentUser);
            const participateSprint = await canParticipateSprint(currentUser);

            // can reach Sprints Management Page
            const manageSprint = createSprint || editSprint || monitorSprint || deleteSprint || participateSprint;  


            // set Sprints permissions
            setCanSprints((prev) => ({
                ...prev,
                create: createSprint,
                edit: editSprint,
                monitor: monitorSprint,
                delete: deleteSprint,
                manage: manageSprint,
            }));

        }
        checkPermissions();
        
    }, []);

    // Callbacks for event handling

    // Create new project
    const handleCreateProject = async (newProject) => {
        try {
            const newProjectFromDB = await createProject(newProject);
            setProjects([...projects, { ...newProjectFromDB }]);
        } catch (error) {
            console.log(error);
        }
    };

    // Edit existing project
    const handleEditProject = async (editedProject) => {
        try {
            const editedProjectFromDB = await updateProject(editedProject);
            setProjects(projects.map(project => project.id === editedProject.id ? editedProjectFromDB : project));
            setEditProject(null);
        } catch (error) {
            console.log(error);
        }
    };

    // Delete project
    const handleDeleteProject = async () => {
        const updatedProjects = projects.filter(project =>
            project.id !== deleteProject.id
        );
        setProjects(updatedProjects);
        try {
            await removeProject(deleteProject.id);
        } catch (error) {
            console.log(error);
        } 
        setDeleteProject(null);
    };


    return (
        <>
            {/* Render Header component */}
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} isShowAdmin={currentUser.role.roleKey == 0} />
            <div style={{ padding: '72px' }}>
                <Typography variant="h3" gutterBottom>Dashboard</Typography>

                <Grid container spacing={3} alignItems="flex-start">

                    {/* New Projects form */}
                    <Grid item xs={12} md={6}>
                        {/* Display 'Add New Project' title with gray color if user has no permission */}
                        <Typography variant="h5" sx={!canProjects.create ? { color: "gray" } : {}}>Add New Project</Typography>
                        <Divider />
                        {/* Render NewProjectForm component */}
                        <NewProjectForm
                            onCreateProject={handleCreateProject}
                            canCreateProject={canProjects.create} />
                    </Grid>

                    {/* Projects List */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">Projects List</Typography>
                        <Divider />
                        {/* Render ProjectsList component and pass necessary props */}
                        <div style={{ maxHeight: '70vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                            <ProjectsList
                                projects={projects}
                                onEdit={(project) => canProjects.edit && setEditProject(project)}
                                onDelete={(project) => canProjects.delete && setDeleteProject(project)}
                                canEditProject={canProjects.edit}
                                canDeleteProject={canProjects.delete}
                                canAllocateProject={canProjects.allocate}
                                canManageSprints={canSprints.manage}
                                users={users}
                            />
                        </div>
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
                        {/* Display message with project name about to be deleted */}
                        <Typography variant="body1">
                            Are you sure you want to delete the project: {deleteProject && deleteProject.name}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteProject(null)} color="primary">Cancel</Button>
                        {/* Display Delete button with delete icon */}
                        <Button onClick={handleDeleteProject} color="error" startIcon={<Delete />}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
