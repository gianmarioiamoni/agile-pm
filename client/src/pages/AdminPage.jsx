import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

import { getCurrentRoles } from "../services/userServices";

export default function AdminPage() {
    const [users, setUsers] = useState([
        { id: 1, name: 'User 1', role: 1 },
        { id: 2, name: 'User 2', role: 2 },
        { id: 3, name: 'User 3', role: 3 },
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: "",
        role: "",
        // Aggiungi altri campi del form qui, se necessario
    });
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentRolesMap, setCurrentRolesMap] = useState([]);

    useEffect(() => {
        // get current rolesMap from the DB
        const setRoles = async () => {
            setCurrentRolesMap(await getCurrentRoles());
        };
        setRoles();

    } , []);

    // New User dialog callback functions
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddUser = () => {
        setOpenDialog(false);
    };

    // Edit and Delete User callback functions
    const handleEditUser = (userId) => {
        // Implementare l'azione di modifica utente
        console.log(`Editing user with ID: ${userId}`);

        setSelectedUserId(userId);
        setEditUserDialogOpen(true);
    };

    const handleCloseEditUserDialog = () => {
        setEditUserDialogOpen(false);
        setSelectedUserId(null);
    };

    // Function to handle chenges in the edit form fields
    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditFormData({ ...editFormData, [id]: value });
    };


    // Function to save modifucations to user information
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
        console.log(`Deleting user with ID: ${userId}`);

        // delete user from the users state
        const idx = users.find((u) => u.id === userId);
        const newUsers = [...users];
        newUsers.splice(idx, 1);
        setUsers(newUsers);

        // delete user from DB

    };

    // get role description from role id
    const getRoleDescription = (roleId) => {
        const roleObj = currentRolesMap.find((r) => r.id === roleId);
        if (!roleObj) {
            return null;
        }
        return roleObj.description;
    }


    return (
        <div>
            <Typography variant="h3" gutterBottom>Admin Console</Typography>
            {/* Registered Users table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Name</TableCell>
                            <TableCell>Role</TableCell>
                            {/* <TableCell>Actions</TableCell> */}
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
                onClick={handleOpenDialog}
            >
                Add User
            </Button>

            {/* New User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddUser} variant="contained" color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User dialog */}
            <Dialog open={editUserDialogOpen} onClose={handleCloseEditUserDialog}>
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
        </div>
    );
}
