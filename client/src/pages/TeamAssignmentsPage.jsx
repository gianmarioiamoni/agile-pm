import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
    Typography,
    Divider,
    Button, IconButton,
    List, ListItem, ListItemText, ListItemSecondaryAction,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

// Importa i tuoi servizi per gestire le assegnazioni dei membri del team per il progetto specifico
// import { getTeamAssignments, addTeamMember, updateTeamMember, removeTeamMember } from "../services/teamAssignmentsServices";

export default function TeamAssignmentsPage ({ projects }) {
    const { projectId } = useParams();
    const [teamAssignments, setTeamAssignments] = useState([]);
    const [projectDescription, setProjectDescription] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        // Simulazione di dati di assegnazione del team per il progetto specifico
        const dummyTeamAssignments = [
            { memberId: '1', memberName: 'John Doe', role: 'Developer' },
            { memberId: '2', memberName: 'Jane Smith', role: 'Designer' },
            { memberId: '3', memberName: 'Alice Johnson', role: 'Manager' }
        ];
        setTeamAssignments(dummyTeamAssignments);

        // project description setup
        const description = projects.find((p) => p.id === projectId)?.description || '';
        setProjectDescription(description);

    }, [projectId, projects]);

    const handleAddMember = () => {
        // Implementa la logica per aggiungere un nuovo membro al team per il progetto specifico
        // addTeamMember(projectId, memberId, memberName, role);
        console.log("handleAddMember()");
    };

    const handleUpdateMember = (memberId, updatedRole) => {
        // Implementa la logica per aggiornare il ruolo di un membro del team per il progetto specifico
        // updateTeamMember(projectId, memberId, updatedRole);
        console.log(`handleUpdateMember() - memberId: ${memberId}, updatedRole: ${updatedRole}`);
    };

    const handleRemoveMember = (memberId) => {
        // Implementa la logica per rimuovere un membro dal team per il progetto specifico
        // removeTeamMember(projectId, memberId);
        console.log(`handleRemoveMember() - memberId: ${memberId}`);
    };

    const handleOpenDialog = (member) => {
        setSelectedMember(member);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Team Assignments for Project {projectDescription}</Typography>
            <Divider />

            {/* Container to limit list width */}
            <div style={{ maxWidth: '40%' }}>
                {/* Team members list */}
                <List>
                    {teamAssignments.map(member => (
                        <ListItem key={member.memberId}>
                            <ListItemText primary={member.memberName} secondary={member.role} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleOpenDialog(member)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleRemoveMember(member.memberId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>

            {/* Button to add a new member */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddMember}
                style={{ marginTop: '20px' }}
            >
                Add Member
            </Button>

            {/* Role update dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogContent>
                    {/* dialog content */}
                    <Typography variant="body1">
                        {/* Contenuto qui */}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCloseDialog} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

