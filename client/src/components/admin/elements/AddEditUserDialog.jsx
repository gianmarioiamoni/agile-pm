import { Hidden, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

import RoleSelect from "./RoleSelect";

import { addUser, editUser, sendNewUserEmail } from "../../../services/userServices";

import { generateRandomPassword } from "../../../utils/utilities";


export default function AddEditUserDialog({
    openDialog,
    handleCloseDialog,
    isEditMode,
    editFormData,
    setEditFormData,
    editedUser,
    setEditedUser,
    currentRolesMap,
    setUsers,
    users
}) {
    console.log("AddEditUserDialog() - editedUser: ", editedUser)
    console.log("AddEditUserDialog() - editFormData: ", editFormData)
    console.log("AddEditUserDialog() - currentRolesMap: ", currentRolesMap)

    if (!currentRolesMap || currentRolesMap.length === 0) {
        console.error('currentRolesMap is not defined or is empty');
        throw new Error('currentRolesMap is not defined or is empty');
    }

    if (!users || users.length === 0) {
        console.error('users is not defined or is empty');
        throw new Error('users is not defined or is empty');
    }

    if (!editedUser && isEditMode) {
        console.error('editedUser is not defined when isEditMode is true');
        throw new Error('editedUser is not defined when isEditMode is true');
    }

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setEditFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    };

    const saveAddUserChanges = async () => {
        try {
            const newPassword = generateRandomPassword();
            const newUser = { ...editFormData, password: newPassword };
            console.log("AddEditUserDialog() - newUser: ", newUser)
            const savedUser = await addUser(newUser);
            console.log("AddEditUserDialog() - savedUser: ", savedUser)
            const newUserRoleObj = currentRolesMap.find((r) => r._id === savedUser.role);
            console.log("AddEditUserDialog() - newUserRoleObj: ", newUserRoleObj)
            const updatedUserWithId = { ...newUser, _id: savedUser?._id, role: newUserRoleObj };
            console.log("AddEditUserDialog() - updatedUserWithId: ", updatedUserWithId)
            setUsers((prevUsers) => [...prevUsers, updatedUserWithId]);
            sendNewUserEmail(newUser.email, newUser.username, newPassword);
            handleCloseDialog();
        } catch (error) {
            console.error('saveAddUserChanges() error: ', error);
            alert('Error creating new user. Please try again.');
        }
    }

    const saveEditUserChanges = async () => {
        try {
            const editedUserIndex = users.findIndex((user) => user._id === editedUser._id);
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
        } catch (error) {
            console.error('saveEditUserChanges() error: ', error);
            alert('Error updating user. Please try again.');
        }
    };

    const handleSaveChanges = async () => {
        if (isEditMode) {
            saveEditUserChanges();
        } else {
            saveAddUserChanges();
        }
    };

    return (
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
                            sx={{ marginBottom: "10px" }}
                        />
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={editFormData.email}
                            onChange={handleFormChange}
                            sx={{ marginBottom: "10px" }}
                        />
                        <RoleSelect
                            disabled={Object.keys(editedUser).length !== 0 && editedUser?.role.roleKey == 0 ? true : false}
                            value={isEditMode ? editedUser.role.roleKey : editFormData.role}
                            onChange={isEditMode ?
                                (e) => setEditedUser((prev) => ({ ...prev, role: { ...prev.role, roleKey: e.target.value } }))
                                :
                                (e) => setEditFormData((prevFormData) => ({ ...prevFormData, role: e.target.value }))
                            }
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
    )
}
