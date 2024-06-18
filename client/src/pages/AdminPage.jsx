import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';

import { useSelector } from 'react-redux';

import UserManagement from "../components/admin/UserManagement";
import RoleManagement from "../components/admin/RoleManagement";
import PermissionManagement from "../components/admin/PermissionManagement";
import Header from "../components/Header";

import { getCurrentRoles } from "../services/roleServices";


/**
 * AdminPage component renders the admin page which includes user management,
 * role management, and permission management.
 *
 * @param {Object} props - The props object containing users, setUsers, currentRolesMap, and setCurrentRolesMap.
 * @param {Array} props.users - The array of users.
 * @param {Function} props.setUsers - The function to update the users.
 * @param {Array} props.currentRolesMap - The array of current roles.
 * @param {Function} props.setCurrentRolesMap - The function to update the current roles.
 * @returns {JSX.Element} The rendered AdminPage component.
 */
export default function AdminPage({ users, setUsers, currentRolesMap, setCurrentRolesMap }) {
    // Get the current user from the Redux store
    const { currentUser } = useSelector((state) => state.user);
    // State to hold the role permissions map
    const [rolePermissionsMap, setRolePermissionsMap] = useState([]);
    // State to keep track of the refresh count
    const [refreshCount, setRefreshCount] = useState(0);

    // Effect hook to initialize the role permissions map
    useEffect(() => {
        // Get the current roles from the database
        const setCurrentRoles = async () => {
            const roles = await getCurrentRoles();
            setCurrentRolesMap(roles);
        };
        setCurrentRoles();
    }, []);

    // Function to refresh the permissions
    const refreshPermissions = () => {
        setRefreshCount((prev) => prev + 1);
    };

    return (
        <>
            {/* Render the header */}
            <Header isShowAbout={true} isShowProfile={true} isShowHome={true} />
            {/* Render the admin page */}
            <Grid container direction="column" spacing={2} padding={3}>
                {/* Top Section */}

                {/* Render the user management and role management */}
                <Grid item container xs={12} sx={{ height: "40%", display: "flex" }}>
                    <Grid item xs={8} sx={{ display: "flex", flexDirection: "column" }}>
                        {/* Render the user management */}
                        <Box sx={{ flex: 1, overflow: "auto" }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">Users Management</Typography>
                            <Divider />
                            <UserManagement
                                users={users}
                                setUsers={setUsers}
                                currentRolesMap={currentRolesMap}
                                currentUser={currentUser}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
                        {/* Render the role management */}
                        <Box sx={{ flex: 1, overflow: "auto" }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">Roles Management</Typography>
                            <Divider />
                            <RoleManagement
                                currentRolesMap={currentRolesMap}
                                setCurrentRolesMap={setCurrentRolesMap}
                                rolePermissionsMap={rolePermissionsMap}
                                refreshPermissions={refreshPermissions}
                                users={users}
                                setUsers={setUsers}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Bottom Section - Permissions Management*/}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Permissions Management</Typography>
                    <Divider />
                    <PermissionManagement
                        rolePermissionsMap={rolePermissionsMap}
                        setRolePermissionsMap={setRolePermissionsMap}
                        refreshCount={refreshCount}
                    />
                </Grid>
            </Grid>
        </>
    );
}
