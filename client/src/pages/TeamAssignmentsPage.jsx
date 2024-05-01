import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import {
    Typography,
    Divider,
    TextField,
    FormControl, FormLabel,
    Button, IconButton,
    RadioGroup, FormControlLabel, Radio,
    List, ListItem, ListItemText, ListItemSecondaryAction,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from '../components/Header';



// Importa i tuoi servizi per gestire le assegnazioni dei membri del team per il progetto specifico
// import { getTeamAssignments, addTeamMember, updateTeamMember, removeTeamMember } from "../services/teamAssignmentsServices";

const UserType = 'USER';

const UserListItem = ({ user, index }) => {

    const [{ isDragging }, drag] = useDrag({
        type: UserType,
        item: () => ({ user, index }),
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });


    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', borderRadius: '4px' }}>
            <ListItem>
                <ListItemText primary={user.username} secondary={user.role} />
            </ListItem>
        </div>
    );
};

const MemberListItem = ({ member, handleAddMember, handleRemoveMember, handleUpdateMember }) => {
    const [{ isOver }, drop] = useDrop({
        accept: UserType,
        drop: (item) => handleAddMember(item.user),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'transparent', padding: '8px', borderRadius: '4px' }}>
            <ListItem>
                <ListItemText primary={member.username} secondary={member.role} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleUpdateMember(member.id, member.role)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleRemoveMember(member)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </div>
    );
};

export default function TeamAssignmentsPage({ projects }) {
    const { currentUser } = useSelector(state => state.user);

    const { projectId } = useParams();
    const [teamAssignments, setTeamAssignments] = useState([]);
    const [projectDescription, setProjectDescription] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [users, setUsers] = useState([]);
    const [sortValue, setSortValue] = useState("username");

    useEffect(() => {
        // Simulazione di dati di assegnazione del team per il progetto specifico
        const dummyTeamAssignments = [
            { id: '1', username: 'John Doe', role: 'Developer' },
            { id: '2', username: 'Jane Smith', role: 'Designer' },
            { id: '3', username: 'Alice Johnson', role: 'Manager' }
        ];
        setTeamAssignments(dummyTeamAssignments);

        const dummyUsers = [
            { id: '100', username: 'Pippo', role: 'Scrum Master' },
            { id: '200', username: 'Pluto', role: 'Product Owner' },
            { id: '300', username: 'Papero', role: 'Scrum Team Member' },
        ];
        setUsers(dummyUsers);
        console.log("dummyUsers: ", dummyUsers)

        // project description setup
        const description = projects.find((p) => p.id === projectId)?.description || '';
        setProjectDescription(description);

    }, [projectId, projects]);

    // add a new team member for the project
    const handleAddMember = (user) => {
        // addTeamMember(projectId, memberId, memberName, role);
        // add new member to teamAssignments
        setTeamAssignments((prev) => [...prev, user]);

        // remove assigned member from available users list
        const filteredUsers = users.filter((u) => u.id !== user.id);
        setUsers(filteredUsers);

    };

    const handleUpdateMember = (memberId, updatedRole) => {
        // Implementa la logica per aggiornare il ruolo di un membro del team per il progetto specifico
        // updateTeamMember(projectId, memberId, updatedRole);
        console.log(`handleUpdateMember() - memberId: ${memberId}, updatedRole: ${updatedRole}`);
    };

    const handleRemoveMember = (member) => {
        // Implementa la logica per rimuovere un membro dal team per il progetto specifico
        // removeTeamMember(projectId, memberId);
        console.log(`handleRemoveMember() - memberId: ${member.id}`);

        // remove member from teamAssignments
        const filteredTeamAssignments = teamAssignments.filter((m) => m.id !== member.id);
        setTeamAssignments(filteredTeamAssignments);

        // add removed member to available users list
        const removedUser = { ...member, id: member.id * 100 };
        setUsers((prev) => [...prev, removedUser])


    };

    const handleOpenDialog = (member) => {
        setSelectedMember(member);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
        console.log("Sort selection: ", event.target.value)
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Header isShowProfile={true} isShowHome={true} isShowAdmin={currentUser.role === 0} isShowDashboard={true} />
            <div  style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Team Assignments for project: {projectDescription}</Typography>
                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '100px', marginTop: '40px' }}>
                    
                    {/* Team members list */}
                    {/* Container to limit list width */}
                    <div style={{ minWidth: '30%'}}>
                        <Typography variant="h6" gutterBottom>Team Members List</Typography>
                        <Typography variant="h8" gutterBottom>drag&drop an user from the Available Users List </Typography>
                        <div>
                        <List dense style={{maxHeight: "70vh", overflow: "auto"}}>
                            {teamAssignments.map((member, index) => (
                                <MemberListItem
                                    key={member.id}
                                    member={member}
                                    handleAddMember={handleAddMember}
                                    handleRemoveMember={handleRemoveMember}
                                    handleUpdateMember={handleUpdateMember}
                                />
                            ))}
                            </List>
                        </div>
                    </div>

                    {/* List of users to add */}
                    <div>
                        <Typography variant="h6" gutterBottom>Available Users</Typography>
                        <Typography variant="h8" gutterBottom>drag&drop to the Team Members area to add an user</Typography>
                        <List dense style={{ maxHeight: "70vh", overflow: "auto" }}>
                            {users !== null && users.length > 0 && users.map((user, index) => (
                                <UserListItem key={user.id} user={user} index={index} />
                            ))}
                        </List>

                        {/* Sorting and searching area */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop:"20px" }}>
                            <FormControl style={{ marginBottom: '10px', minWidth: "40%" }}>
                                <FormLabel id="sort-radio-buttons-group">Sort by;</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="sort-radio-buttons-group"
                                    name="sort-radio-buttons-group"
                                    value={sortValue}
                                    onChange={handleSortChange}
                                >
                                    <FormControlLabel value="username" control={<Radio size="small"/>} label="Username" />
                                    <FormControlLabel value="role" control={<Radio size="small"/>} label="Role" />
                                </RadioGroup>
                            </FormControl>

                            {/* Filter text input */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FormControl style={{ marginBottom: '10px', minWidth: "40%" }}>
                                    <FormLabel id="search-text-field">Search</FormLabel>
                                    <TextField
                                        name="search-text-field"
                                    size="small"
                                    type="text"
                                    placeholder="Search..."
                                    style={{ marginBottom: '10px', width: '100%' }}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

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
        </DndProvider>
    );
};
