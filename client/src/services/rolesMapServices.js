import axios from 'axios';

// function to get the default or the current roles map from the server
export const getRolePermissionsMap = async (name) => {
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
export const updateRolePermissionsMap = async (name, mapData) => {
    try {
        const response = await axios.put(`/server/roles-map/${name}`, mapData);
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


// Project Permissions
export const canCreateProject = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-create-project/`, user);

    console.log("canCreateProject() - res: ", res)

    return res.data;
};

export const canViewProject = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-view-project/`, user);

    return res.data;
};

export const canEditProject = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-edit-project/`, user);

    return res.data;
};

export const canDeleteProject = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-delete-project/`, user);

    return res.data;
};

export const canAllocateProject = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-allocate-project/`, user);

    return res.data;
};

// Sprint Permissions
export const canCreateSprint = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-create-sprint/`, user);

    console.log("canCreateSprint() - res: ", res)

    return res.data;
};  

export const canMonitorSprint = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-monitor-sprint/`, user);

    return res.data;    
};

export const canEditSprint = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-edit-sprint/`, user);

    return res.data;
};

export const canDeleteSprint = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-delete-sprint/`, user);

    return res.data;
};

export const canParticipateSprint = async (user) => {
    const res = await axios.put(`/server/roles-map/check/can-participate-sprint/`, user);   

    return res.data;
};

