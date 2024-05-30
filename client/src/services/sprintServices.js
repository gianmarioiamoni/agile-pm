import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export const addSprint = async (sprint) => {
    try {
        const response = await axios.post("/server/sprints", sprint);
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const getAllSprints = async () => {
    try {
        const response = await axios.get("/server/sprints");
        return response.data;
    } catch (err) { console.log(err) }
};

export const getSprint = async (id) => {
    try {
        const response = await axios.get(`/server/sprints/${id}`);
        return response.data;
    } catch (err) { console.log(err) }
};

export const getSprintsByProjectId = async (projectId) => {
    try {
        const response = await axios.get(`/server/sprints/project/${projectId}`);
        return response.data;
    } catch (err) { console.log(err) }
};

export const updateSprint = async (sprint) => {
    try {
        const response = await axios.put(`/server/sprints/${sprint._id}`, sprint);
        return response.data;
    } catch (err) { console.log(err) }
};

export const removeSprint = async (id) => {
    try {
        const response = await axios.delete(`/server/sprints/${id}`);
        return response.data;
    } catch (err) { console.log(err) }
};


