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
    

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setEditFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
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

    const saveEditUserChanges = async () => {
        // const editedUserIndex = users.findIndex((user) => user.id === selectedUserId);
        const editedUserIndex = users.findIndex((user) => user.id === editedUser.id);
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

    )

}