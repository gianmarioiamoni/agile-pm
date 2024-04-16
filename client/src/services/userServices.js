import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";


export async function getDefaultRoles() {
    const roleName = "default";
    try {
        const defaultRolesArray = await axios.get(`/server/roles/${roleName}`);
        console.log("defaultRoleArray: ", defaultRolesArray)

        return defaultRolesArray.data.roles;
    } catch (error) {
        
    }
}

export async function getCurrentRoles() {
    const roleName = "current";
    try {
        const defaultRolesArray = await axios.get(`/server/roles/${roleName}`);
        console.log("defaultRoleArray: ", defaultRolesArray)

        return defaultRolesArray.data.roles;
    } catch (error) {

    }
}

export async function createNewRoles(rolesObj) {
    try {
        console.log("userServices() - createNewRoles() - rolesObj: ", rolesObj)
        await axios.post("/server/roles", rolesObj);
    } catch (error) {
        
    }
}