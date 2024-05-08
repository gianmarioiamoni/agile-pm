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
import { getPermissionsLabelValues, getRolePermissionsMap, updateRolePermissionsMap } from "../../services/rolesMapServices";


export default function RoleManagement({ currentRolesMap, setCurrentRolesMap, rolePermissionsMap, refreshPermissions }) {

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
            console.log("defRoles: ", defRoles)

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
        setOpenRoleEditDialog(false);
    };

    const handleSaveRole = async () => {
        // Verify if we are adding a new role or editing an existing one
        const existingRole = currentRolesMap.find(role => role.roleKey === roleEditFormData.roleKey);
        if (existingRole) {
            // Editing an existing role
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

            // update DB with edited role
            try {
                // await editRoles(updatedRoles);
                await editRole(roleEditFormData.roleKey, roleEditFormData.roleDescription);
            } catch (err) {
                console.log(err)
            }

            // updated current and default role-permissions map in DB
            const updatedRolePermissionsMap = rolePermissionsMap.map((role) => {
                if (role.role === existingRole.roleDescription) {
                    return { ...role, role: roleEditFormData.roleDescription }
                };
                return role;
            });

            try {
                await updateRolePermissionsMap("current", updatedRolePermissionsMap);
                
                const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
                const updatedDefaultRolePermissionsMap = await defaultRolesPermissionsMap.map((role) => {
                    
                    if (role.role === existingRole.roleDescription) {
                        return { ...role, role: roleEditFormData.roleDescription };
                    }
                    return role;
                });
                await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap)
                refreshPermissions();
            } catch (error) {
                console.log(error)
            }

        } else {
            // Adding a new role
            const newRoleKey = currentRolesMap[currentRolesMap.length - 1].roleKey + 1;
            console.log("adding a new role - currentRolesMap: ", currentRolesMap)
            const newRole = { roleKey: newRoleKey, roleDescription: roleEditFormData.roleDescription };
            setCurrentRolesMap((prev) => ([...prev, newRole]));

            // update role-permissions map with the new role
            const newRoleForPermissionsMap = {
                role: newRole.roleDescription,
                permissions: []
            };

            // update DB with new role
            try {
                await addRole(newRole.roleKey, newRole.roleDescription);
            } catch (err) {
                console.log(err)
            }

            // update DB with new current and default role-permissions map
            try {
                await updateRolePermissionsMap("current", [...rolePermissionsMap, newRoleForPermissionsMap]);

                const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
                const updatedDefaultRolePermissionsMap = [...defaultRolesPermissionsMap, newRoleForPermissionsMap];
                await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap);

                refreshPermissions();

            } catch (err) {
                console.log(err)
            }
        }

        // close the dialog
        handleCloseRoleEditDialog();
    }; // handleSaveRole()

    const handleEditRole = (roleKey) => {
        // find the selected role
        const selectedRole = currentRolesMap.find(role => role.roleKey === roleKey);
        if (selectedRole) {
            // setup role data into the edit form
            setRoleEditFormData({ roleKey: selectedRole.roleKey, description: selectedRole.roleDescription });
            // open the role edit dialog
            setOpenRoleEditDialog(true);
        }
    };

    const handleDeleteRole = async (roleKey) => {
        // filter the roles excluding the one to be deleted
        const roleDescrToDelete = currentRolesMap.find((r) => r.roleKey === roleKey).roleDescription;
        const updatedRoles = currentRolesMap.filter(role => role.roleKey !== roleKey);
        // update the current roles map
        setCurrentRolesMap(updatedRoles);

        // update DB with deleted role
        try {
            // await editRoles(updatedRoles);
            await deleteRole(roleKey)
            alert(`role ${roleDescrToDelete} deleted`);
        } catch (err) {
            alert("Impossible to delete the role");
            console.log(err)
        }

        // update current and default role-permissions map with deleted role
        const updatedRolePermissionsMap = rolePermissionsMap.filter((rp) => rp.role !== roleDescrToDelete);
        try {
            await updateRolePermissionsMap("current", [...updatedRolePermissionsMap]);
            
            const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
            const updatedDefaultRolePermissionsMap = defaultRolesPermissionsMap.filter((rp) => rp.role !== roleDescrToDelete)
            await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap)
            
            refreshPermissions();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRestoreDefault = async () => {
        try {
            // copy default RolesMap into current
            const defaultRolesArray = await getDefaultRoles();
            await restoreRoles(defaultRolesArray);
            setCurrentRolesMap(defaultRolesArray);
            
            
            // set current and default rolePermissionsMap with default roles
            const updatedRolePermissionsMap = rolePermissionsMap.slice(0, defaultRolesArray.length - 1);
            await updateRolePermissionsMap("current", updatedRolePermissionsMap)
            
            const defaultRolesPermissionsMap = await getRolePermissionsMap("default");
            const updatedDefaultRolePermissionsMap = defaultRolesPermissionsMap.slice(0, defaultRolesArray.length)
            await updateRolePermissionsMap("default", updatedDefaultRolePermissionsMap)

            refreshPermissions();

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
