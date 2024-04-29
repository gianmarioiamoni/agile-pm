import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Grid,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper
} from '@mui/material';
import { Edit, Delete, LockReset, Add, ArrowDownward } from '@mui/icons-material';

import AddEditUserDialog from './elements/AddEditUserDialog';

import { deleteUser } from "../../services/userServices";

export default function UserManagement({ users, setUsers, currentRolesMap, currentUser }) {

    const [openDialog, setOpenDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        username: "",
        email: "",
        role: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
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
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsEditMode(false);
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

    const handleResetPassword = async (userId) => {
        const userDescr = users.find((u) => u.id === userId).username;
        console.log("reset password for user: ", userDescr)
    }

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
                                        <IconButton onClick={() => handleDelete(user.id)} aria-label="delete" disabled={user.id === currentUser._id}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleResetPassword(user.id)} aria-label="reset">
                                            <LockReset fontSize="small" />
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
            <AddEditUserDialog
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                isEditMode={isEditMode}
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                editedUser={editedUser}
                setEditedUser={setEditedUser}
                currentRolesMap={currentRolesMap}
                users={users}
                setUsers={setUsers}
            />
            </Grid>
    );
}
