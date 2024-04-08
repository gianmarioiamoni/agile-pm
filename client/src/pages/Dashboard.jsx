import { useSelector } from 'react-redux';

import Header from "../components/Header";

// project specific imports
import React, { useState } from 'react';
import { Grid, Typography, Divider } from '@mui/material';
import { AddCircle } from '@mui/icons-material';

import ProjectsList from "../components/project/ProjectsList";
import NewProjectForm from "../components/project/NewProjectForm";


export default function Dashboard() {
    const { currentUser } = useSelector(state => state.user);

    // project specific logic
    const [projects, setProjects] = useState([
        { id: 1, name: 'Project 1', description: 'Description of Project 1' },
        { id: 2, name: 'Project 2', description: 'Description of Project 2' },
        // Add more dummy projects as needed
    ]);

    const handleCreateProject = (newProject) => {
        setProjects([...projects, { id: projects.length + 1, ...newProject }]);
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
                            <ProjectsList projects={projects} />
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

            </div>
        </>
    )
}
