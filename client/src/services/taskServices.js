import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export const getAvailableTasksAndSprintTasks = async () => {
    try {
        const response = await axios.get("/server/tasks");
        return response.data;
    } catch (err) { console.log(err) }
};

export const getTasksBySprintId = async (sprintId) => {
    try {
        const response = await axios.get(`/server/tasks/sprint/${sprintId}`);
        return response.data;
    } catch (err) { console.log(err) }
};

export const updateTaskAssignment = async (taskId, sprintId) => {
    try {
        const response = await axios.post('/server/tasks/assign', { taskId, sprintId });
        return response.data;
    } catch (error) {
        console.error('Error assigning task:', error);
    }
};

// export const updateTaskStatus = async (taskId, status) => {
//     try {
//         const response = await axios.post('/server/tasks/updateStatus', { taskId, status });
//         return response.data;
//     } catch (error) {
//         console.error('Error updating task status:', error);


//     }
// };

export const updateTaskStatus = async (taskId, backlogItemId) => {
    try {
        const response = await axios.put(`/server/tasks/${taskId}/updateStatus`, { backlogItemId });
        return response.data;
    } catch (err) {
        console.error('Error updating task status:', err);
    }
};