import { Hidden, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

import RoleSelect from "./RoleSelect";

import { addUser, editUser, sendNewUserEmail } from "../../../services/userServices";

import { generateRandomPassword } from "../../../utils/utilities";

/**
 * Component for adding or editing a user.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.openDialog - Whether the dialog is open or not.
 * @param {function} props.handleCloseDialog - Function to close the dialog.
 * @param {boolean} props.isEditMode - Whether we are editing an existing user or adding a new one.
 * @param {Object} props.editFormData - The form data for editing a user.
 * @param {function} props.setEditFormData - Function to set the form data for editing a user.
 * @param {Object} props.editedUser - The user object being edited.
 * @param {function} props.setEditedUser - Function to set the user object being edited.
 * @param {Array} props.currentRolesMap - The current roles map.
 * @param {function} props.setUsers - Function to set the users array.
 * @param {Array} props.users - The users array.
 * @return {JSX.Element} The rendered component.
 */
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
    /**
     * Handles form changes.
     *
     * @param {Object} e - The event object.
     */
    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setEditFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    };

    /**
     * Saves changes for adding a new user.
     *
     * @return {Promise<void>} - A promise that resolves when the changes are saved.
     */
    const saveAddUserChanges = async () => {
        try {
            const newPassword = generateRandomPassword();
            const newUser = { ...editFormData, password: newPassword };
            const savedUser = await addUser(newUser);
            const newUserRoleObj = currentRolesMap.find((r) => r._id === savedUser.role);
            const updatedUserWithId = { ...newUser, _id: savedUser?._id, role: newUserRoleObj };
            setUsers((prevUsers) => [...prevUsers, updatedUserWithId]);
            sendNewUserEmail(newUser.email, newUser.username, newPassword);
            handleCloseDialog();
        } catch (error) {
            console.error('saveAddUserChanges() error: ', error);
            alert('Error creating new user. Please try again.');
        }
    };

    /**
     * Saves changes for editing an existing user.
     *
     * @return {Promise<void>} - A promise that resolves when the changes are saved.
     */
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
                };
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

    /**
     * Handles saving changes for either adding or editing a user.
     *
     * @return {Promise<void>} - A promise that resolves when the changes are saved.
     */
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
