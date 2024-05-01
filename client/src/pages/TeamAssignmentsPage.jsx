// TeamAssignmentsPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Divider, Button } from '@mui/material';

// Qui importa i tuoi servizi per gestire le assegnazioni dei membri del team per il progetto specifico
// import { getTeamAssignments, addTeamMember, updateTeamMember, removeTeamMember } from "../services/teamAssignmentsServices";

export default function TeamAssignmentsPage ({projects}) {
    const { projectId } = useParams();
    const [teamAssignments, setTeamAssignments] = useState([]);
    const [projectDescription, setProjectDescription] = useState();

    useEffect(() => {
        // Qui ottieni le assegnazioni del team per il progetto specifico
        // const fetchTeamAssignments = async () => {
        //   const assignments = await getTeamAssignments(projectId);
        //   setTeamAssignments(assignments);
        // };
        // fetchTeamAssignments();

        // Ecco un array vuoto per simulare i dati di assegnazione del team per il progetto specifico
        const dummyTeamAssignments = [
            { memberId: '1', memberName: 'John Doe', role: 'Developer' },
            { memberId: '2', memberName: 'Jane Smith', role: 'Designer' },
            { memberId: '3', memberName: 'Alice Johnson', role: 'Manager' }
        ];
        setTeamAssignments(dummyTeamAssignments);

        // set project description
        const description = projects.find((p) => p.id === projectId).description;
        setProjectDescription(description);

    }, [projectId]);

    const handleAddMember = () => {
        // Qui implementa la logica per aggiungere un nuovo membro al team per il progetto specifico
        // addTeamMember(projectId, memberId, memberName, role);
        console.log("handleAddMember()")
    };

    const handleUpdateMember = (memberId, updatedRole) => {
        // Qui implementa la logica per aggiornare il ruolo di un membro del team per il progetto specifico
        // updateTeamMember(projectId, memberId, updatedRole);
        console.log(`handleUpdateMember() - memberId: ${memberId}, updatedRole: ${updatedRole}`)
    };

    const handleRemoveMember = (memberId) => {
        // Qui implementa la logica per rimuovere un membro dal team per il progetto specifico
        // removeTeamMember(projectId, memberId);
        console.log(`handleRemoveMember() - memberId: ${memberId}`)
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Team Assignments for Project {projectDescription}</Typography>
            <Divider />

            {/* Show team members list and options for CRUD operations on members */}
            
            <div>
                <Typography variant="h5" gutterBottom>Team Members</Typography>
                {teamAssignments.map(member => (
                    <div key={member.memberId}>
                        <Typography>{member.memberName} - {member.role}</Typography>
                        <Button onClick={() => handleUpdateMember(member.memberId, 'New Role')}>Update Role</Button>
                        <Button onClick={() => handleRemoveMember(member.memberId)}>Remove Member</Button>
                    </div>
                ))}
            </div>

            {/* option to add a new member to the team */}
            <div>
                <Typography variant="h5" gutterBottom>Add New Member</Typography>
                {/* Qui puoi avere un modulo per aggiungere un nuovo membro al team */}
                <Button onClick={handleAddMember}>Add Member</Button>
            </div>
        </div>
    );
};

