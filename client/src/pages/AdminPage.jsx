// AdminPage.jsx

import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import RoleManagement from '../components/admin/RoleManagement';

import { getCurrentRoles } from '../services/userServices';

export default function AdminPage() {

    // states and dialog for Roles Management
    const [currentRolesMap, setCurrentRolesMap] = useState([]);

    useEffect(() => {
        // get current rolesMap from the DB
        const setCurrentRoles = async () => {
            const r = await getCurrentRoles()
            setCurrentRolesMap(r);
            // setRoles(r);
        };
        setCurrentRoles();

    }, []);


    return (
        <Grid container spacing={2}>
            {/* Users Management */}
            <Grid item xs={6}>
                <Typography variant="h3" gutterBottom>Users Management</Typography>
                <UserManagement currentRolesMap={ currentRolesMap} />
            </Grid>

            {/* Roles Management */}
            <Grid item xs={6}>
                <Typography variant="h3" gutterBottom>Roles Management</Typography>
                <RoleManagement currentRolesMap={currentRolesMap} setCurrentRolesMap={setCurrentRolesMap} />
            </Grid>
        </Grid>
    );
}

