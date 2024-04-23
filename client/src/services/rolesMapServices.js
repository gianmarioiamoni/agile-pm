import axios from 'axios';

// function to get the default or the current roles map from the server
export const getRolesMap = async (name) => {
    try {
        const response = await axios.get(`/server/roles-map/${name}`);
        console.log("response: ", response)
        if (!response) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error during getting roles map from the server:', error);
        throw error;
    }
};

// function to create a roles map (default o current) on the server
export const createRolesMap = async (mapData) => {
    try {
        const response = await axios.post('/server/roles-map', mapData);
        return response.data;
    } catch (error) {
        console.error('Error during saving roles map on the server:', error);
        throw error;
    }
};

// function to update a roles map (default or current) on the server
export const updateRolesMap = async (name, mapData) => {
    try {
        const response = await axios.put(`/server/roles-map/${name}`, mapData);
        return response.data;
    } catch (error) {
        console.error('Error during roles map update on the server:', error);
        throw error;
    }
};
