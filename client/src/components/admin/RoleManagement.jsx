import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
    IconButton,
    Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Box
} from '@mui/material';
import { Edit, Delete, Add, ArrowDownward, Restore } from '@mui/icons-material';

import { v4 as uuidv4 } from 'uuid';

import { addRole, editRole, deleteRole, getDefaultRoles, restoreRoles } from "../../services/roleServices";
import { getRolePermissionsMap, updateRolePermissionsMap } from "../../services/rolesMapServices";


export default function RoleManagement({ currentRolesMap, setCurrentRolesMap, rolePermissionsMap, refreshPermissions, users, setUsers }) {

    const [openRoleEditDialog, setOpenRoleEditDialog] = useState(false);
    const [roleEditFormData, setRoleEditFormData] = useState({
        roleKey: "",
        roleDescription: "",
    });
    const [defaultRolesMap, setDefaultRolesMap] = useState([]);
    // const [permissionsLabelValueArray, setPermissionsLabelValueArray] = useState([]);

    const [hasScrollableContent, setHasScrollableContent] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        const initState = async () => {
            // const plv = await getPermissionsLabelValues();
            // setPermissionsLabelValueArray(plv);
            const defRoles = await getDefaultRoles();

            setDefaultRolesMap(defRoles)
        };
        initState();

    }, [])

    useEffect(() => {
        const updateScrollableContent = () => {
            setHasScrollableContent(tableRef.current && tableRef.current.scrollHeight > tableRef.current.clientHeight);
        };
        // Update initial state
        updateScrollableContent();

        // Update the state everytime there is a change in the 'currentRolesMap' array
        const handleResize = () => {
            updateScrollableContent();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentRolesMap]);

    const handleOpenRoleEditDialog = () => {
        setOpenRoleEditDialog(true);
    };

    const handleCloseRoleEditDialog = () => {
        setRoleEditFormData({ roleKey: "", roleDescription: "" });
        setOpenRoleEditDialog(false);
    };

    const handleSaveRole = async () => {
    const updateUsersRole = async () => {
        const updatedUsers = users.map((user) => {
            if (user.role?.roleKey === roleEditFormData.roleKey) {
                return {
                    ...user,
                    role: {
                        roleKey: roleEditFormData.roleKey,
                        roleDescription: roleEditFormData.roleDescription
                    }
                };
            }
            return user;
        });
        setUsers(updatedUsers);
    }
    
    try {
        const existingRole = currentRolesMap.find(role => role.roleKey === roleEditFormData.roleKey);
        console.log("handleSaveRole - existingRole: ", existingRole);
        if (existingRole) {
            // Edit existing role
            if (!roleEditFormData || !roleEditFormData.roleKey || !roleEditFormData.roleDescription) {
                console.log("Error: roleEditFormData is missing key or description");
                return;
            }
            const updatedRoles = currentRolesMap.map(role => {
                if (role.roleKey === roleEditFormData.roleKey) {
                    return {
                        ...role,
                        roleDescription: roleEditFormData.roleDescription
                    };
                }
                return role;
            });
            setCurrentRolesMap(updatedRoles);
            updateUsersRole();

            await editRole(roleEditFormData.roleKey, roleEditFormData.roleDescription);

            const updatedRolePermissionsMap = rolePermissionsMap.map((role) => {
                if (role.role === existingRole.roleDescription) {
                    return { ...role, role: roleEditFormData.roleDescription }
                };
                return role;
            });

            await updateRolePermissionsMap("current", updatedRolePermissionsMap);
            
            const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
            const updatedDefaultRolePermissionsMap = defaultRolesPermissionsMap.map((role) => {
                if (role.role === existingRole.roleDescription) {
                    return { ...role, role: roleEditFormData.roleDescription };
                }
                return role;
            });
            await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap);
            refreshPermissions();
        } else {
            // Add new role
            const newRoleKey = currentRolesMap.length > 0 ? currentRolesMap[currentRolesMap.length - 1].roleKey + 1 : 1;
            const newRole = { roleKey: newRoleKey, roleDescription: roleEditFormData.roleDescription };

            const newRoleForPermissionsMap = {
                role: newRole.roleDescription,
                permissions: []
            };

            const res = await addRole(newRole.roleKey, newRole.roleDescription);
            setCurrentRolesMap((prev) => ([...prev, { ...newRole, _id: res._id }]));

            await updateRolePermissionsMap("current", [...rolePermissionsMap, newRoleForPermissionsMap]);

            const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
            const updatedDefaultRolePermissionsMap = [...defaultRolesPermissionsMap, newRoleForPermissionsMap];
            await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap);

            refreshPermissions();
        }
    } catch (error) {
        console.log(error);
    }

    handleCloseRoleEditDialog();
};

const handleEditRole = (roleKey) => {
    try {
        const selectedRole = currentRolesMap.find(role => role.roleKey === roleKey);
        console.log("handleEditRole - selectedRole: ", selectedRole);
        if (selectedRole) {
            setRoleEditFormData((prev) => ({...prev, roleKey: selectedRole.roleKey, roleDescription: selectedRole.roleDescription }));
            setOpenRoleEditDialog(true);
        } else {
            console.log("Selected role not found");
        }
    } catch (error) {
        console.log("An error occurred:", error);
    }
};

    const handleDeleteRole = async (roleKey) => {
        // filter the roles excluding the one to be deleted
        const roleDescrToDelete = currentRolesMap.find((r) => r.roleKey === roleKey).roleDescription;
        const roleId = currentRolesMap.find((r) => r.roleKey === roleKey)._id;

        // update DB with deleted role
        try {
            const res = await deleteRole(roleId);

            if (res.success) {
                const updatedRoles = currentRolesMap.filter(role => role.roleKey !== roleKey);
                // update the current roles map
                setCurrentRolesMap(updatedRoles);
                alert(`role ${roleDescrToDelete} deleted successfully`);

                // update current and default role-permissions map with deleted role
                const updatedRolePermissionsMap = rolePermissionsMap.filter((rp) => rp.role !== roleDescrToDelete);
                await updateRolePermissionsMap("current", [...updatedRolePermissionsMap]);

                const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
                const updatedDefaultRolePermissionsMap = defaultRolesPermissionsMap.filter((rp) => rp.role !== roleDescrToDelete)
                await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap)

                refreshPermissions();
            }
            else {
                alert(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRestoreDefault = async () => {
        try {
            // copy default RolesMap into current
            const defaultRolesArray = await getDefaultRoles();
            const res = await restoreRoles(defaultRolesArray);
            if (res.success) {
                setCurrentRolesMap(defaultRolesArray);

                // set current and default rolePermissionsMap with default roles
                const updatedRolePermissionsMap = rolePermissionsMap.slice(0, defaultRolesArray.length - 1);
                await updateRolePermissionsMap("current", updatedRolePermissionsMap)

                const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
                const updatedDefaultRolePermissionsMap = defaultRolesPermissionsMap.slice(0, defaultRolesArray.length)
                await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap)

                refreshPermissions();
            } else {
                alert(res.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <TableContainer component={Paper} ref={tableRef} sx={{ position: "relative", height: '30vh', overflowY: "auto" }}>
                {hasScrollableContent && (
                    <div style={{ position: "absolute", right: "10px", bottom: "10px" }}>
                        <IconButton>
                            <ArrowDownward />
                        </IconButton>
                    </div>
                )}
                <Table size="small" dense="true">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Role Description</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRolesMap.map((role) => (
                            <TableRow key={uuidv4()}>
                                <TableCell>{role.roleDescription}</TableCell>
                                {/* Buttons to edit and delete roles. Visible only for custom roles */}
                                {/* {role.roleKey > 3 ? ( */}
                                {role.roleKey > defaultRolesMap.length-1 ? (
                                    <TableCell>
                                        <IconButton onClick={() => handleEditRole(role.roleKey)} aria-label="edit">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteRole(role.roleKey)} aria-label="delete">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                ) : (
                                    ""
                                )}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* button to add a new role */}
            <Box display="flex" alignItems="flex-start"  >
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenRoleEditDialog}
                        fullWidth
                    >
                        Add Role
                    </Button>
                </Grid>
                {/* button to restore default role */}
                <Grid item xs={4} sx={{marginLeft: 2}}>
                    <Button
                        variant="contained"
                        startIcon={<Restore />}
                        onClick={handleRestoreDefault}
                        fullWidth
                    >
                        Default
                    </Button>
                </Grid>
            </Box>

            {/* Dialog to add/edit a role */}
            <Dialog open={openRoleEditDialog} onClose={handleCloseRoleEditDialog}>
                <DialogTitle>{roleEditFormData.roleKey ? 'Edit Role' : 'Add Role'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Role Description"
                        type="text"
                        fullWidth
                        value={roleEditFormData.roleDescription}
                        onChange={(e) => setRoleEditFormData((prev) => ({ ...prev, roleDescription: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRoleEditDialog}>Cancel</Button>
                    <Button onClick={handleSaveRole} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
