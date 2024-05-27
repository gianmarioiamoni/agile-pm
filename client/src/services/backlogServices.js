import axios from 'axios';

export const createBacklogItem = async (data) => {
    const response = await axios.post('/server/backlog-items/create', data);
    return response.data;
};

// export const getBacklogItem = async (id) => {
//     const response = axios.get(`/server/backlog-items/${id}`);
//     return response.data;
// }

// 
export const getBacklogItem = async (itemId) => {
    try {
        console.log('Fetching backlog item with ID:', itemId); // Log per verificare l'ID passato
        const response = await axios.get(`/server/backlog-items/${itemId}`);
        console.log('Response from server:', response); // Log della risposta completa
        return response.data;
    } catch (error) {
        console.error('Error fetching backlog item:', error); // Log dell'errore
        return undefined;
    }
};

export const getBacklogItems = async (projectId) => {
    try {
        const response = await axios.get(`/server/backlog-items/project/${projectId}`);
        return response.data;
    } catch (err) {
        console.error('Error fetching backlog items:', err);
    }
};

export const updateBacklogItem = async (id, data) => {
    try {
        const response = await axios.put(`/server/backlog-items/update/${id}`, data);
        return response.data;
    } catch (err) {
        console.error('Error updating backlog item:', err);
    }
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

export const updateBacklogItemPriorities = async (backlogItems) => {
    try {
        const response = await axios.put("/server/backlog-items/priorities", { backlogItems });
        return response.data;
    } catch (err) {
        console.log(err);
    }
};
