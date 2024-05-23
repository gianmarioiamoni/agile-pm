import axios from 'axios';

export const createBacklogItem = async (data) => {
    const response = await axios.post('/server/backlog/create', data);
    return response.data;
};

export const getBacklogItems = async (projectId) => {
    const response = await axios.get(`/server/backlog/project/${projectId}`);
    return response.data;
};

export const updateBacklogItem = async (id, data) => {
    const response = await axios.put(`/server/backlog/update/${id}`, data);
    return response.data;
};

export const deleteBacklogItem = async (id) => {
    const response = await axios.delete(`/server/backlog/delete/${id}`);
    return response.data;
};
