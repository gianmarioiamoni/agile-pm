import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";


export async function getDefaultRoles() {
    const roleName = "default";
    try {
        const defaultRolesArray = await axios.get(`/server/roles/${roleName}`);

        return defaultRolesArray.data.roles;
    } catch (error) {
        
    }
}

export async function getDefaultPermissions() {
    const permissionsName = "default";
    try {
        const defaultPermissionsArray = await axios.get(`/server/permissions/${permissionsName}`);

        return defaultPermissionsArray.data.permissions;
    } catch (error) {

    }
}

export async function getCurrentRoles() {
    const roleName = "current";
    try {
        const currentRolesArray = await axios.get(`/server/roles/${roleName}`);

        return currentRolesArray.data.roles;
    } catch (error) {

    }
}

export async function getCurrentPermissions() {
    const permissionName = "current";
    try {
        const currentPermissionsArray = await axios.get(`/server/permissions/${permissionName}`);

        return currentPermissionsArray.data.permissions;
    } catch (error) {

    }
}

export async function createNewRoles(rolesObj) {
    try {
        await axios.post("/server/roles", rolesObj);
    } catch (error) {
        
    }
}

export async function createNewPermissions(permissionsObj) {
    try {
        await axios.post("/server/permissions", permissionsObj);
    } catch (error) {

    }
}