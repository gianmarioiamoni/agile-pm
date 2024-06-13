// ./src/services/taskServices.js

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


export const getTasksByBacklogItemId = async (itemId) => {
    try {
        const response = await axios.get(`/server/tasks/backlogItems/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks by backlog item ID:', error);
        return [];
    }
};


export const updateTaskAssignment = async (taskId, sprintId, projectId) => {
    try {
        const response = await axios.post('/server/tasks/assign', { taskId, sprintId, projectId });
        return response.data;
    } catch (error) {
        console.error('Error assigning task:', error);
    }
};

export const createTask = async (backlogItemId, projectId, data) => {
    data = { ...data, backlogItemId, projectId };

    try {
        if (data.assignee === '') {
            data.assignee = undefined
        }
        const response = await axios.post('/server/tasks', data);

        // add task to backlog item
        await axios.put(`/server/backlog-items/addTask/${backlogItemId}`, { taskId: response.data._id });

        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
    }
};

export const updateTask = async (taskId, data) => {
    try {
        const response = await axios.put(`/server/tasks/${taskId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
    }
}
export const updateTaskStatus = async (taskId, status, backlogItemId) => {

    try {
        const response = await axios.put(`/server/tasks/${taskId}/updateStatus`, { status, backlogItemId });
        return response.data;
    } catch (err) {
        console.error('Error updating task status:', err);
        console.error('Error message:', err.message);
    }
};

export const deleteTask = async (taskId, backlogItemId) => {
    try {
        const response = await axios.delete(`/server/tasks/${taskId}`);

        // delete task from backlog item
        await axios.put(`/server/backlog-items/deleteTask/${backlogItemId}`, { taskId });

        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};