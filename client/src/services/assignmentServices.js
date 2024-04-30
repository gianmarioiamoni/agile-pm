import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export async function getProjectAssignments(projectId) {
    try {
        const response = await axios.get(`/server/assignments/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
    
}