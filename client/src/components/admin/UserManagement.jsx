import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Grid,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Hidden
} from '@mui/material';
import { Edit, Delete, Add, ArrowDownward } from '@mui/icons-material';

import RoleSelect from "./elements/RoleSelect";

import { deleteUser, addUser, editUser, sendNewUserEmail } from "../../services/userServices";
import { generateRandomPassword } from "../../utils/utilities";

export default function UserManagement({ users, setUsers, currentRolesMap }) {

    const [openDialog, setOpenDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        username: "",
        email: "",
        role: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [hasScrollableContent, setHasScrollableContent] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        const updateScrollableContent = () => {
            setHasScrollableContent(tableRef.current && tableRef.current.scrollHeight > tableRef.current.clientHeight);
        };

        // Update initial state
        updateScrollableContent();

        // Update the state everytime there is a change in the 'users' array
        const handleResize = () => {
            updateScrollableContent();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [users]);

    const handleOpenDialog = (userId = null) => {
        if (userId) {
            setIsEditMode(true);
            const user = users.find((u) => u.id === userId);
            setEditedUser(user);
            setEditFormData({
                username: user.username,
                email: user.email,
                role: user.role,
            });
        } else {
            setIsEditMode(false);
            setEditFormData({
                username: "",
                email: "",
                role: "",
            });
        }
        setSelectedUserId(userId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUserId(null);
        setIsEditMode(false);
    };

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        console.log("id: ", id)
        console.log("value: ", value)
        setEditFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    }; 

    const saveEditUserChanges = async () => {
        const editedUserIndex = users.findIndex((user) => user.id === selectedUserId);
        if (editedUserIndex !== -1) {
            const updatedUsers = [...users];
            const edUser = {
                ...updatedUsers[editedUserIndex],
                username: editFormData.username,
                email: editFormData.email,
                role: editedUser.role,
            }
            updatedUsers[editedUserIndex] = edUser;

            setUsers(updatedUsers);

            // save changes to DB
            await editUser(edUser);

            handleCloseDialog();
            alert('User details updated successfully!');
        } else {
            console.error('User not found for editing.');
            alert('User not found for editing. Please try again.');
        }
    };

    const saveAddUserChanges = async () => {
        const newPassword = generateRandomPassword();
        const newUser = { ...editFormData, password: newPassword };
        const savedUser = await addUser(newUser);
        const updatedUserWithId = { ...newUser, id: savedUser?._id };
        setUsers((prevUsers) => [...prevUsers, updatedUserWithId]);
        sendNewUserEmail(newUser.email, newUser.username, newPassword);
        handleCloseDialog();
    }

    const handleSaveChanges = async () => {
        if (isEditMode) {
            saveEditUserChanges();
        } else {
            saveAddUserChanges();
        }
    };

    const handleDelete = async (userId) => {
        const userDescr = users.find((u) => u.id === userId).username;
        const newUsers = users.filter((user) => user.id !== userId);
        setUsers(newUsers);
        const res = await deleteUser(userId);
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
        <Grid container spacing={2}>
            {/* Users Table */}
            <Grid item xs={12}>
                {hasScrollableContent && (
                    <div style={{ position: "absolute", right: "10px", bottom: "10px" }}>
                        <IconButton>
                            <ArrowDownward />
                        </IconButton>
                    </div>
                )}
                <TableContainer component={Paper} sx={{ position: "relative", overflowY: "auto" }}>
                    <Table size="small" dense="true">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>User Name</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>Role</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    {/* User details */}
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleDescription(user.role)}</TableCell>
                                    {/* Actions for the User */}
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(user.id)} aria-label="edit">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(user.id)} aria-label="delete">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            {/* Add User Button */}
            <Grid item xs={12} md={6}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    fullWidth
                >
                    Add User
                </Button>
            </Grid>

            {/* Add/Edit User Dialog */}
            <Hidden smDown>
                <Grid item md={6}>
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>{isEditMode ? 'Edit User' : 'Add User'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="username"
                                label="Username"
                                type="text"
                                fullWidth
                                value={editFormData.username}
                                onChange={handleFormChange}
                            />
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                fullWidth
                                value={editFormData.email}
                                onChange={handleFormChange}
                            />
                            <RoleSelect
                                value={isEditMode ? editedUser.role : editFormData.role}
                                onChange={isEditMode ?
                                    (e) => setEditedUser((prev) => ({ ...prev, role: e.target.value }))
                                    :
                                    (e) => setEditFormData((prevFormData) => ({ ...prevFormData, role: e.target.value }))}
                                roles={currentRolesMap}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={handleSaveChanges} variant="contained" color="primary">
                                {isEditMode ? 'Save Changes' : 'Add'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Hidden>
        </Grid>
    );
}
