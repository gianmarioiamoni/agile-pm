// RoleManagement.jsx
import React, { useState } from 'react';
import {
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

export default function RoleManagement({currentRolesMap, setCurrentRolesMap}) {


    // State for role add/edit dialog
    const [openRoleEditDialog, setOpenRoleEditDialog] = useState(false);
    const [roleEditFormData, setRoleEditFormData] = useState({
        id: "",
        description: "",
    });

    // Function to open the add/edit role dialog
    const handleOpenRoleEditDialog = () => {
        setOpenRoleEditDialog(true);
    };

    // Function to close the dialog
    const handleCloseRoleEditDialog = () => {
        setOpenRoleEditDialog(false);
    };

    // Function to add or edit a role
    const handleSaveRole = () => {
        // Verify if we are adding a new role or editing an existing one
        const existingRole = currentRolesMap.find(role => role.id === roleEditFormData.id);
        if (existingRole) {
            // Editing of an existing role
            const updatedRoles = currentRolesMap.map(role => {
                if (role.id === roleEditFormData.id) {
                    return {
                        ...role,
                        description: roleEditFormData.description
                    };
                }
                return role;
            });
            setCurrentRolesMap(updatedRoles);
        } else {
            // Adding a new role
            const newRoleId = currentRolesMap[currentRolesMap.length - 1].id + 1;
            const newRole = { id: newRoleId, description: roleEditFormData.description };
            setCurrentRolesMap((prev) => ([...prev, newRole]));
        }

        // close the dialog
        handleCloseRoleEditDialog();
    };

    // Function to open the role edit dialog
    const handleEditRole = (roleId) => {
        // find the selected role
        const selectedRole = currentRolesMap.find(role => role.id === roleId);
        if (selectedRole) {
            // setup role data into the edit form
            setRoleEditFormData({ id: selectedRole.id, description: selectedRole.description });
            // open the role edit dialog
            setOpenRoleEditDialog(true);
        }
    };

    // Function to delete a role
    const handleDeleteRole = (roleId) => {
        // filter the roles excluding the one to be deleted
        const updatedRoles = currentRolesMap.filter(role => role.id !== roleId);
        setCurrentRolesMap(updatedRoles);
    };

    // get role description from role id
    const getRoleDescription = (roleId) => {
        const roleObj = currentRolesMap.find((r) => r.id === roleId);
        return roleObj ? roleObj.description : null;
    };

    return (
        // JSX per la gestione dei ruoli
        // <Typography variant="h3" gutterBottom>Roles Management</Typography>
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Role Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRolesMap.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.description}</TableCell>
                                {/* Buttons to edit and delete roles. Visible only for custom roles */}
                                {role.id > 3 ? (
                                    <TableCell>
                                        <IconButton onClick={() => handleEditRole(role.id)} aria-label="edit">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteRole(role.id)} aria-label="delete">
                                            <Delete />
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
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenRoleEditDialog}
            >
                Add Role
            </Button>

            {/* Dialog to add/edit a role */}
            <Dialog open={openRoleEditDialog} onClose={handleCloseRoleEditDialog}>
                <DialogTitle>{roleEditFormData.id ? 'Edit Role' : 'Add Role'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Role Description"
                        type="text"
                        fullWidth
                        value={roleEditFormData.description}
                        onChange={(e) => setRoleEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRoleEditDialog}>Cancel</Button>
                    <Button onClick={handleSaveRole} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>  
        </>

    )
}