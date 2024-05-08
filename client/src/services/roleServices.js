import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";


// ROLES

export async function getDefaultRoles() {
    const roleName = "default";
    try {
        const defaultRolesArray = await axios.get(`/server/roles/${roleName}`);

        return defaultRolesArray.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentRoles() {
    const roleName = "current";
    try {
        const currentRolesArray = await axios.get(`/server/roles/${roleName}`);
        return currentRolesArray.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addRole(key, description) {
    try {
        const res = await axios.post("/server/roles", { roleKey: key, roleDescription: description });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editRole(id, description) {
    try {
        await axios.put(`/server/roles/${id}`, { id, description });
    } catch (error) {
        console.log(error);
    }
}

export async function deleteRole(id) {
    try {
        await axios.delete(`/server/roles/${id}`);
    } catch (error) {
        console.log(error);
    }
}

export async function restoreRoles(rolesArray) {
    try {
        await axios.put(`/server/roles`, rolesArray);
        return;
    } catch (error) {
        console.log(error);
    } 
}

