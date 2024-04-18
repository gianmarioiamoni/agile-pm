import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography,
    Grid,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

import { getCurrentRoles } from "../services/userServices";

export default function AdminPage() {

    // USE EFFECT

    useEffect(() => {
        // get current rolesMap from the DB
        const setCurrentRoles = async () => {
            const r = await getCurrentRoles()
            console.log("AdminPage() - useEffect() - r: ", r)
            setCurrentRolesMap(r);
            // setRoles(r);
        };
        setCurrentRoles();

    }, []);


    // USER MANAGEMENT 

    // states and Edit dialog for User Management
    const [users, setUsers] = useState([
        { id: 1, name: 'User 1', role: 1 },
        { id: 2, name: 'User 2', role: 2 },
        { id: 3, name: 'User 3', role: 3 },
    ]);
    const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
    const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: "",
        role: "",
        // Aggiungi altri campi del form qui, se necessario
    });

    // New User dialog callback functions
    const handleOpenNewUserDialog = () => {
        setOpenNewUserDialog(true);
    };

    const handleCloseNewUserDialog = () => {
        setOpenNewUserDialog(false);
    };

    const handleAddUser = () => {
        setOpenNewUserDialog(false);
    };
    
    const [selectedUserId, setSelectedUserId] = useState(null);

    // ROLES MANAGEMENT

    // states and dialog for Roles Management
    const [currentRolesMap, setCurrentRolesMap] = useState([]);

    // Stato per il dialog di aggiunta/aggiornamento ruolo
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
            // const newRoleId = currentRolesMap.length + 1; // generate a new Id based on the roles array length
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
        // setRoles(updatedRoles);
        setCurrentRolesMap(updatedRoles);
    };

    // Edit and Delete User callback functions
    const handleEditUser = (userId) => {
        setSelectedUserId(userId);
        setOpenEditUserDialog(true);
    };

    const handleCloseEditUserDialog = () => {
        setOpenEditUserDialog(false);
        setSelectedUserId(null);
    };

    // Function to handle changes in the edit form fields
    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditFormData({ ...editFormData, [id]: value });
    };


    // Function to save modifications to user information
    const handleSaveUserChanges = () => {
        // find the user in the users state
        const editedUserIndex = users.findIndex(user => user.id === selectedUserId);
        // check if the user has been found
        if (editedUserIndex !== -1) {
            // copy users list to avoid mutability
            const updatedUsers = [...users];
            // update user details in the copied array
            console.log("editFormData: ", editFormData)
            updatedUsers[editedUserIndex] = {
                ...updatedUsers[editedUserIndex],
                // update user fields with the information from the edit form dialog
                name: editFormData.name,
                // Aggiorna altri campi dell'utente se necessario
            };
            setUsers(updatedUsers);
            // close the edit user dialog 
            handleCloseEditUserDialog();
            alert('User details updated successfully!');
        } else {
            console.error('User not found for editing.');
            alert('User not found for editing. Please try again.');
        }
    };


    // Callback per l'azione di eliminazione utente
    const handleDeleteUser = (userId) => {
        // delete user from the users state
        const newUsers = users.filter((u) => u.id !== userId);
        setUsers(newUsers);

        // delete user from DB
    };

    // get role description from role id
    const getRoleDescription = (roleId) => {
        const roleObj = currentRolesMap.find((r) => r.id === roleId);
        return roleObj ? roleObj.description : null;
    };

    return (
        <Grid container spacing={2}>
            {/* Users Management */}
            <Grid item xs={6}>
                <Typography variant="h3" gutterBottom>Users Management</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{getRoleDescription(user.role)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditUser(user.id)} aria-label="edit">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteUser(user.id)} aria-label="delete">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add New User Button */}
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenNewUserDialog}
                >
                    Add User
                </Button>

                {/* New User Dialog */}
                <Dialog open={openNewUserDialog} onClose={handleCloseNewUserDialog}>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="role"
                            label="Role"
                            type="number"
                            fullWidth
                        />
                        {/* Aggiungere altri campi per l'inserimento dell'utente */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseNewUserDialog}>Cancel</Button>
                        <Button onClick={handleAddUser} variant="contained" color="primary">Add</Button>
                    </DialogActions>
                </Dialog>

                {/* Edit User dialog */}
                <Dialog open={openEditUserDialog} onClose={handleCloseEditUserDialog}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="name"
                            label="Name"
                            defaultValue={selectedUserId ? users.find(user => user.id === selectedUserId).name : ''}
                            onChange={handleEditChange}
                        />
                        {/* Altri campi per la modifica dell'utente */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditUserDialog}>Cancel</Button>
                        <Button onClick={handleSaveUserChanges}>Save Changes</Button>
                    </DialogActions>
                </Dialog>
            </Grid>

            {/* Roles Management */}
            <Grid item xs={6}>
                <Typography variant="h3" gutterBottom>Roles Management</Typography>
                {/* Code to manage roles */}
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

            </Grid>
        </Grid>
    );
}
