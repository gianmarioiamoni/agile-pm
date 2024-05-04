import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export async function getAssignments(projectId) {
    try {
        const response = await axios.get(`/server/assignments/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
    
}

export async function saveAssignments(projectId, assignments) {
    const payload = {
        userId: assignments.userId,
        roleDescription: assignments.roleDescription,
        role: assignments.role
    };

    try {
        const isAssignmentsExist = await axios.get(`/server/assignments/project/${projectId}`);
        if (!isAssignmentsExist) {
            // create a new assignments for the project
            const response = await axios.post(`/server/assignments/project/${projectId}`, payload);
            return response.data;
        }
        // update an existing assignments for the project
        const response = await axios.put(`/server/assignments/project/${projectId}`, payload);
            return response.data;
    } catch (error) {
        console.log(error); 
    }
}