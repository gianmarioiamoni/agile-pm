import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export const getAvailableTasksAndSprintTasks = async () => {
    try {
        const response = await axios.get("/server/tasks");
        return response.data;
    } catch (err) { console.log(err) }
}