import axios from 'axios';

// function to get the default or the current roles map from the server
export const getRolesMap = async (name) => {
    try {
        const response = await axios.get(`/server/roles-map/${name}`);
        if (!response) {
            return null;
        }
        return response.data.roles;
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
        console.log("updateRolesMap() - mapData: ", mapData)
        const response = await axios.put(`/server/roles-map/${name}`, mapData);
        console.log("updateRolesMap() - response: ", response)
        return response.data;
    } catch (error) {
        console.error('Error during roles map update on the server:', error);
        throw error;
    }
};

export const getPermissionsLabelValues = async () => {
    const res = await axios.get("/server/roles-map/permissions-label-values");

    return res.data;
};

export const canCreateProject = async (user) => {
    console.log("canCreateProject() - user: ", user);
    const res = await axios.put(`/server/roles-map/can-create-project/`, user);
    console.log("canCreateProject() - res: ", res)

    return res.data;
};

export const canViewProject = async (user) => {
    const res = await axios.put(`/server/roles-map/can-view-project/`, user);

    return res.data;
};

export const canEditProject = async (user) => {
    const res = await axios.put(`/server/roles-map/can-edit-project/`, user);

    return res.data;
};

export const canDeleteProject = async (user) => {
    const res = await axios.put(`/server/roles-map/can-delete-project/`, user);

    return res.data;
};
