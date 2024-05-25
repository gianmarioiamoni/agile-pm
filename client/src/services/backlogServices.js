import axios from 'axios';

export const createBacklogItem = async (data) => {
    const response = await axios.post('/server/backlog-items/create', data);
    return response.data;
};

export const getBacklogItems = async (projectId) => {
    const response = await axios.get(`/server/backlog-items/project/${projectId}`);
    return response.data;
};

export const updateBacklogItem = async (id, data) => {
    const response = await axios.put(`/server/backlog-items/update/${id}`, data);
    return response.data;
};

export const deleteBacklogItem = async (id) => {
    const response = await axios.delete(`/server/backlog-items/delete/${id}`);
    return response.data;
};

export const updatePriorities = async (projectId, items) => {
    console.log("updatePriorities", items);

    const response = await axios.put(`/server/backlog-items/projects/${projectId}/reorder`, { items });
    return response.data;
};
