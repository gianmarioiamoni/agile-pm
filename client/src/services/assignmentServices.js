import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export async function getAssignments(projectId) {
    try {
        const response = await axios.get(`/server/assignments/project/${projectId}`);
        const assignmentsFromDB = response.data;
        console.log("getAssignments() - assignmentsFromDB: ", assignmentsFromDB)
        const teamAssignments = assignmentsFromDB.map((a) => ({
            _id: a._id,
            userId: a.userId._id,
            username: a.userId.username,
            roleId: a.roleId._id,
            roleDescription: a.roleId.roleDescription
        }));
        console.log("getAssignments() - teamAssignments: ", teamAssignments)

        return teamAssignments;
    } catch (error) {
        console.log(error);
    }
    
}

export async function saveAssignments(projectId, assignments) {
    const payload = assignments.map((a) => ({ ...a, projectId }));

    try {
        // create a new assignments for the project
        const response = await axios.put(`/server/assignments/project/${projectId}`, { payload });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}