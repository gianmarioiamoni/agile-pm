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

import RoleSelect from "./elements/RoleSelect";

import { deleteUser } from '../../services/userServices';

export default function UserManagement({ users, setUsers, currentRolesMap }) {

    const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
    const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        username: "",
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
                username: editFormData.username,
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

    const handleDeleteUser = async (userId) => {
        const userDescr = users.find((u) => u.id === userId).username;
        const newUsers = users.filter((user) => user.id !== userId);
        setUsers(newUsers);

        // delete role from the DB
        const res = await deleteUser(userId);

        console.log("res: ", res)

        if (res.status === 200) {
            alert(`User ${userDescr} successfully deleted`);
        } else {
            alert("Impossible to delete the user");
        }
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
                                <TableCell>{user.username}</TableCell>
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
                        id="username"
                        label="Username"
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
                        id="username"
                        label="User Name"
                        defaultValue={selectedUserId ? users.find((user) => user.id === selectedUserId).username : ''}
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
