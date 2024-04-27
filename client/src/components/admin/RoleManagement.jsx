import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper,
} from '@mui/material';
import { Edit, Delete, Add, ArrowDownward } from '@mui/icons-material';

import { editRoles } from '../../services/userServices';


export default function RoleManagement({ currentRolesMap, setCurrentRolesMap }) {

    const [openRoleEditDialog, setOpenRoleEditDialog] = useState(false);
    const [roleEditFormData, setRoleEditFormData] = useState({
        id: "",
        description: "",
    });

    const [hasScrollableContent, setHasScrollableContent] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        const updateScrollableContent = () => {
            setHasScrollableContent(tableRef.current && tableRef.current.scrollHeight > tableRef.current.clientHeight);
        };
        // Update initial state
        updateScrollableContent();

        // Update the state everytime there is a change in the 'currentRolesMap' array
        const handleResize = () => {
            updateScrollableContent();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentRolesMap]);

    const handleOpenRoleEditDialog = () => {
        setOpenRoleEditDialog(true);
    };

    const handleCloseRoleEditDialog = () => {
        setOpenRoleEditDialog(false);
    };

    const handleSaveRole = async () => {
        // Verify if we are adding a new role or editing an existing one
        const existingRole = currentRolesMap.find(role => role.id === roleEditFormData.id);
        if (existingRole) {
            // Editing an existing role
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
         
            // update DB
            try {
                await editRoles(updatedRoles);
            } catch (err) {
                console.log(err)
            }

        } else {
            // Adding a new role
            const newRoleId = currentRolesMap[currentRolesMap.length - 1].id + 1;
            const newRole = { id: newRoleId, description: roleEditFormData.description };
            console.log("RoleManagement() - handleSaveRole() - newRole: ", newRole)
            setCurrentRolesMap((prev) => ([...prev, newRole]));

            // update DB
            try {
                await editRoles([...currentRolesMap, newRole]);
            } catch (err) {
                console.log(err)
            }
        }

        // close the dialog
        handleCloseRoleEditDialog();
    };

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

    const handleDeleteRole = async (roleId) => {
        // filter the roles excluding the one to be deleted
        const roleDescrToDelete = currentRolesMap.find((r) => r.id === roleId).description;
        const updatedRoles = currentRolesMap.filter(role => role.id !== roleId);
        // update the current roles map
        setCurrentRolesMap(updatedRoles);

        // update the DB
        const res = await deleteRole(roleId);
        if (res) {
            alert(`role ${roleDescr} deleted`);
        } else {
            alert("Impossible to delete the role");
        }

    };

    return (
        <>
            <TableContainer component={Paper} ref={tableRef} sx={{ position: "relative", height: '30vh', overflowY: "auto" }}>
                {hasScrollableContent && (
                    <div style={{ position: "absolute", right: "10px", bottom: "10px" }}>
                        <IconButton>
                            <ArrowDownward />
                        </IconButton>
                    </div>
                )}
                <Table size="small" dense="true">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Role Description</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
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
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteRole(role.id)} aria-label="delete">
                                            <Delete fontSize="small" />
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
    );
}
