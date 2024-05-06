import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import {
    Typography,
    Divider,
    TextField,
    FormControl, FormLabel,
    Button,
    RadioGroup, FormControlLabel, Radio,
    List
    // Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from "../components/Header";
import UserListItem from "../components/assignment/UserListItem";
import MemberListItem from "../components/assignment/MemberListItem";

import { getAssignments, saveAssignments } from "../services/assignmentServices";



// Importa i tuoi servizi per gestire le assegnazioni dei membri del team per il progetto specifico
// import { getTeamAssignments, addTeamMember, updateTeamMember, removeTeamMember } from "../services/teamAssignmentsServices";


export default function TeamAssignmentsPage({ projects, users, currentRolesMap }) {
    const { currentUser } = useSelector(state => state.user);

    const { projectId } = useParams();
    const [teamAssignments, setTeamAssignments] = useState([]);
    const [projectDescription, setProjectDescription] = useState('');
    // const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    // const [availableUsers, setAvailableUsers] = useState([...users].sort((a, b) => a.username.localeCompare(b.username)));
    // const [availableUsers, setAvailableUsers] = useState([...users].map((u) => ({ ...u, roleDescription: currentRolesMap.find((r) => (r.id === u.role)).description })).sort((a, b) => a.username.localeCompare(b.username)));
    const [availableUsers, setAvailableUsers] = useState([...users].map((u) => ({ ...u, role: currentRolesMap.find((r) => (r.roleId === u.role)).roleDescription })).sort((a, b) => a.username.localeCompare(b.username)));
    const [originalUsers, setOriginalUsers] = useState([...users].map((u) => ({ ...u, roleDescription: currentRolesMap.find((r) => (r.roleId === u.role)).roleDescription })).sort((a, b) => a.username.localeCompare(b.username)));
    // const [originalUsers, setOriginalUsers] = useState([[...users].sort((a, b) => a.username.localeCompare(b.username))]);
    // const [availableUsers, setAvailableUsers] = useState([]);
    // const [originalUsers, setOriginalUsers] = useState([]);

    const [sortValue, setSortValue] = useState("username");
    const [isSaveChanges, setIsSaveChanges] = useState(false);

    // add roleDescription to users
    const getLocalUsers = () => {
        // const localUsers = [...users].map((u) => ({ ...u, roleDescription: currentRolesMap.find((r) => (r.id === u.role)).description }))
        const localUsers = [...users].map((u) => ({ ...u, role: currentRolesMap.find((r) => (r.roleId === u.role)).roleDescription }))
        console.log("localUser: ", localUsers)
        localUsers.sort((a, b) => a.username.localeCompare(b.username))

        return localUsers;
    };

    useEffect(() => {
        // Simulazione di dati di assegnazione del team per il progetto specifico
        const dummyTeamAssignments = [
            { id: '1', username: 'John Doe', roleDescription: 'Developer', role: '11' },
            { id: '2', username: 'Jane Smith', roleDescription: 'Designer', role: '22' },
            { id: '3', username: 'Alice Johnson', roleDescription: 'Manager', role: '33' }
        ];
        setTeamAssignments(dummyTeamAssignments);

        // const dummyUsers = [
        //     { id: '100', username: 'Pippo', role: 'Scrum Master' },
        //     { id: '200', username: 'Pluto', role: 'Product Owner' },
        //     { id: '300', username: 'Papero', role: 'Scrum Team Member' },
        // ];

        // for page reload
        setAvailableUsers(getLocalUsers);
        setOriginalUsers(getLocalUsers);


        // project description setup
        const description = projects.find((p) => p.id === projectId)?.description || '';
        setProjectDescription(description);

    }, [projectId, projects]);

    useEffect(() => {
        const sortedArray = [...availableUsers];
        sortValue === "username" ?
            sortedArray.sort((a, b) => a.username.localeCompare(b.username))
            :
            sortedArray.sort((a, b) => a.roleDescription.localeCompare(b.roleDescription))
        setAvailableUsers(sortedArray);
        setOriginalUsers(sortedArray);
    }, [sortValue])
    

    // add a new team member for the project
    const handleAddMember = (user) => {
        console.log("handleAddMember() - user: ", user)
        const newMember = {id: uuidv4(), username: user.username, roleDescription: user.role}
        
        // add new member to teamAssignments
        // const newUser = { ...user, _id: users.find((u) => u.role === user.role)._id }
        setTeamAssignments((prev) => [...prev, newMember]);

        // remove assigned member from available users list
        const filteredUsers = availableUsers.filter((u) => u.id !== user.id);
        setAvailableUsers(filteredUsers);
        setOriginalUsers(filteredUsers);
        setIsSaveChanges(true);

    };

    const handleRemoveMember = (member) => {

        // remove member from teamAssignments
        const filteredTeamAssignments = teamAssignments.filter((m) => m.id !== member.id);
        setTeamAssignments(filteredTeamAssignments);

        // add removed member to available users list
        const removedUser = { ...member, id: uuidv4(), role: member.roleDescription };
        setAvailableUsers((prev) => [...prev, removedUser]);
        setOriginalUsers((prev) => [...prev, removedUser]);

        setIsSaveChanges(true);
    };

    const handleSaveChanges = () => {
        console.log("save changes: ", teamAssignments);
        setIsSaveChanges(false);


    };

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value;

        const filteredUsers = originalUsers.filter((u) =>
            u.username.toLowerCase().includes(searchValue.toLowerCase()) ||
            u.roleDescription.toLowerCase().includes(searchValue.toLowerCase()));
        setAvailableUsers(filteredUsers);
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
                    <div style={{ minWidth: '30%' }}>
                        <Typography variant="h6" gutterBottom>Team Members List</Typography>
                        <Typography variant="h8" gutterBottom>drag&drop an user from the Available Users List </Typography>
                        <div style={{ maxHeight: "70vh", overflow: "auto", marginTop: '20px', padding: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'blue', borderRadius: '10px' }}>
                            <List dense >
                                {teamAssignments.map((member, index) => (
                                    <MemberListItem
                                        key={uuidv4()}
                                        member={member}
                                        handleAddMember={handleAddMember}
                                        handleRemoveMember={handleRemoveMember}
                                        // handleUpdateMember={handleUpdateMember}
                                        handleSaveChanges={handleSaveChanges}
                                    />
                                ))}
                            </List>
                        </div>
                        {/* button to save assignments */}
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveChanges}
                                fullWidth
                                style={{ borderRadius: '10px' }}
                                disabled={!isSaveChanges}
                            >
                                Save Assignments
                            </Button>
                        </div>
                    </div>

                    {/* List of available users to add */}
                    <div>
                        <Typography variant="h6" gutterBottom>Available Users</Typography>
                        <Typography variant="h8" gutterBottom>drag&drop to the Team Members area to add an user</Typography>
                        <div style={{ maxHeight: "70vh", overflow: "auto", marginTop: '20px', padding: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'blue', borderRadius: '10px' }}>
                            <List dense style={{ maxHeight: "70vh", overflow: "auto" }}>
                                {availableUsers !== null && availableUsers.length > 0 && availableUsers.map((user, index) => (
                                    <UserListItem key={uuidv4()} user={user} index={index} />
                                ))}
                            </List>
                        </div>

                        {/* Sorting and searching options */}
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
                                        onChange={handleSearchChange}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Role update dialog */}
            {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCloseDialog} color="primary">Save</Button>
                </DialogActions>
            </Dialog> */}

        </DndProvider>
    );
};
