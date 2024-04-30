import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';

import { useSelector } from 'react-redux';

import UserManagement from "../components/admin/UserManagement";
import RoleManagement from "../components/admin/RoleManagement";
import PermissionManagement from "../components/admin/PermissionManagement";
import Header from "../components/Header";

import { getCurrentUsers } from "../services/userServices";
import { getCurrentRoles } from "../services/roleServices";


export default function AdminPage() {
    const { currentUser } = useSelector(state => state.user);
    const [rolePermissionsMap, setRolePermissionsMap] = useState([]);
    const [refreshCount, setRefreshCount] = useState(0);

    // states for users management
    const [users, setUsers] = useState([]);

    // state for Roles Management
    const [currentRolesMap, setCurrentRolesMap] = useState([]);

    useEffect(() => {
        // get current users from the DB
        const setCurrentUsers = async () => {
            const u = await getCurrentUsers();
            setUsers(u);
        };
        setCurrentUsers();

        // get current rolesMap from the DB
        const setCurrentRoles = async () => {
            const r = await getCurrentRoles();
            setCurrentRolesMap(r);
            // setRoles(r);
        };
        setCurrentRoles();

    }, []);

    const refreshPermissions = () => {
        setRefreshCount((prev) => prev + 1)
    }

    return (
        <>
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} />
            <Grid container direction="column" spacing={2} padding={3}>
                {/* Top Section */}

                <Grid item container xs={12} sx={{ height: "40%", display: "flex" }}>
                    {/* Left side */}
                    <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ flex: 1, overflow: "auto" }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">Users Management</Typography>
                            <Divider />
                            <UserManagement users={users} setUsers={setUsers} currentRolesMap={currentRolesMap} currentUser={currentUser} />
                        </Box>
                    </Grid>
                    {/* Right side */}
                    <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ flex: 1, overflow: "auto" }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">Roles Management</Typography>
                            <Divider />
                            <RoleManagement
                                currentRolesMap={currentRolesMap} setCurrentRolesMap={setCurrentRolesMap}
                                rolePermissionsMap={rolePermissionsMap}  
                                refreshPermissions={refreshPermissions}
                                />
                        </Box>
                    </Grid>
                </Grid>

                {/* Bottom Section */}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Permissions Management</Typography>
                    <Divider />
                    <PermissionManagement rolePermissionsMap={rolePermissionsMap} setRolePermissionsMap={setRolePermissionsMap} 
                        refreshCount={refreshCount}
                    />
                </Grid>
            </Grid>
        </>
    );
}
