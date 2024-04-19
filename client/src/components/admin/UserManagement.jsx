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

import RoleSelect from './elements/RoleSelect';

export default function UserManagement({ currentRolesMap }) {
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
    });

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleOpenNewUserDialog = () => {
        setOpenNewUserDialog(true);
    };

    const handleCloseNewUserDialog = () => {
        setOpenNewUserDialog(false);
    };

    const handleAddUser = () => {
        const newUser = { ...editFormData, id: users.length + 1 };
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setOpenNewUserDialog(false);
    };

    const handleEditUser = (userId) => {
        setSelectedUserId(userId);
        setOpenEditUserDialog(true);
    };

    const handleCloseEditUserDialog = () => {
        setOpenEditUserDialog(false);
        setSelectedUserId(null);
    };

    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    };

    const handleSaveUserChanges = () => {
        const editedUserIndex = users.findIndex((user) => user.id === selectedUserId);
        if (editedUserIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[editedUserIndex] = {
                ...updatedUsers[editedUserIndex],
                name: editFormData.name,
                role: editFormData.role,
            };
            setUsers(updatedUsers);
            handleCloseEditUserDialog();
            alert('User details updated successfully!');
        } else {
            console.error('User not found for editing.');
            alert('User not found for editing. Please try again.');
        }
    };

    const handleDeleteUser = (userId) => {
        const newUsers = users.filter((user) => user.id !== userId);
        setUsers(newUsers);
    };

    const getRoleDescription = (roleId) => {
        const roleObj = currentRolesMap.find((role) => role.id === roleId);
        return roleObj ? roleObj.description : null;
    };

    return (
        <>
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

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenNewUserDialog}
            >
                Add User
            </Button>

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
                        onChange={handleEditChange}
                    />
                    <RoleSelect
                        value={editFormData.role}
                        onChange={(e) => setEditFormData((prevFormData) => ({ ...prevFormData, role: e.target.value }))}
                        roles={currentRolesMap}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewUserDialog}>Cancel</Button>
                    <Button onClick={handleAddUser} variant="contained" color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditUserDialog} onClose={handleCloseEditUserDialog}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        id="name"
                        label="Name"
                        defaultValue={selectedUserId ? users.find((user) => user.id === selectedUserId).name : ''}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditUserDialog}>Cancel</Button>
                    <Button onClick={handleSaveUserChanges}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
