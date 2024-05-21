import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { UserType } from '../utils/types';
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
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

import Header from "../components/Header";
import UserListItem from "../components/assignment/UserListItem";
import MemberListItem from "../components/assignment/MemberListItem";

import { getAssignments, saveAssignments } from "../services/assignmentServices";

// import { getTeamAssignments, addTeamMember, updateTeamMember, removeTeamMember } from "../services/teamAssignmentsServices";


export default function TeamAssignmentsPage({ projects, users, currentRolesMap }) {
    const { currentUser } = useSelector(state => state.user);

    const { projectId } = useParams();

    const [teamAssignments, setTeamAssignments] = useState([]);
    const [projectDescription, setProjectDescription] = useState('');

    const [selectedMember, setSelectedMember] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([...users].map((u) => (
        {
            userId: u._id,
            username: u.username,
            roleId: currentRolesMap.find((r) => (r.roleKey === u.role.roleKey))._id,
            roleDescription: currentRolesMap.find((r) => (r.roleKey === u.role.roleKey)).roleDescription 
        })).sort((a, b) => a.username.localeCompare(b.username)));
    const [originalUsers, setOriginalUsers] = useState([...users].map((u) => (
        {
            userId: u._id,
            username: u.username,
            roleId: currentRolesMap.find((r) => (r.roleKey === u.role.roleKey))._id,
            roleDescription: currentRolesMap.find((r) => (r.roleKey === u.role.roleKey)).roleDescription 
        })).sort((a, b) => a.username.localeCompare(b.username)));

    const [sortValue, setSortValue] = useState("username");
    const [isSaveChanges, setIsSaveChanges] = useState(false);

    const initUsersAndAssignments = async () => {
        // get assignments from DB and set state
        const assignments = await getAssignments(projectId);
        setTeamAssignments(assignments);

        // filter users to include available users only and set state
        const filteredUsers = users.filter(u => !assignments.some(a => a.userId === u._id));
        const localUsers = filteredUsers.map((u) => (
            {
                userId: u._id,
                username: u.username,
                role: currentRolesMap.find((r) => (r.roleKey === u.role.roleKey))._id,
                roleDescription: currentRolesMap.find((r) => (r.roleKey === u.role.roleKey)).roleDescription
            }));
        localUsers.sort((a, b) => a.username.localeCompare(b.username));
        setAvailableUsers(localUsers);
        setOriginalUsers(localUsers);
    };

    useEffect(() => {

        // for page reload
        initUsersAndAssignments();

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
        const newMemberRoleId = currentRolesMap.find((r) => r.roleDescription === user.roleDescription)._id;
        const newMember = {
            _id: uuidv4(),
            userId: user.userId,
            username: user.username,
            roleId: newMemberRoleId,
            roleDescription: user.roleDescription
        }
        
        // add new member to teamAssignments
        setTeamAssignments((prev) => [...prev, newMember]);

        // remove assigned member from available users list
        const filteredUsers = availableUsers.filter((u) => u.userId !== newMember.userId);
        setAvailableUsers(filteredUsers);
        setOriginalUsers(filteredUsers);
        setIsSaveChanges(true);
    };

    const handleRemoveMember = (member) => {
        // remove member from teamAssignments
        const filteredTeamAssignments = teamAssignments.filter((m) => m._id !== member._id);
        setTeamAssignments(filteredTeamAssignments);

        // add removed member to available users list
        const removedUser = { ...member, _id: member.userId, role: member.role };
        setAvailableUsers((prev) => [...prev, removedUser]);
        setOriginalUsers((prev) => [...prev, removedUser]);

        setIsSaveChanges(true);
    };

    const handleSaveChanges = async () => {
        try {
            await saveAssignments(projectId, teamAssignments);
        } catch (error) {
            console.log(error);
        }
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

    const [{ isOver }, drop] = useDrop({
        accept: UserType,
        drop: (item) => handleAddMember(item.user),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <>
            <Header isShowProfile={true} isShowHome={true} isShowAdmin={currentUser.role === 0} isShowDashboard={true} />
            <div  style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Team Assignments for project: {projectDescription}</Typography>
                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '100px', marginTop: '40px' }}>
                    
                    {/* Team members list */}
                    <div style={{ minWidth: '30%' }}>
                        <Typography variant="h6" gutterBottom>Team Members List</Typography>
                        <Typography variant="h8" gutterBottom>drag&drop an user from the Available Users List </Typography>
                        <div ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'transparent', maxHeight: "70vh", overflow: "auto", marginTop: '20px', padding: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'blue', borderRadius: '10px' }}>
                            <List dense >
                                {teamAssignments?.map((member, index) => (
                                    <MemberListItem
                                        key={uuidv4()}
                                        member={member}
                                        handleAddMember={handleAddMember}
                                        handleRemoveMember={handleRemoveMember}
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
        </> 
    );
};
