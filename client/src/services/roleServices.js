import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";


// ROLES

export async function getDefaultRoles() {
    const roleName = "default";
    try {
        const defaultRolesArray = await axios.get(`/server/roles/${roleName}`);

        return defaultRolesArray.data.roles;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentRoles() {
    const roleName = "current";
    try {
        const currentRolesArray = await axios.get(`/server/roles/${roleName}`);

        return currentRolesArray.data.roles;
    } catch (error) {
        console.log(error);
    }
}

export async function createNewRoles(rolesObj) {
    try {
        await axios.post("/server/roles", rolesObj);
    } catch (error) {
        console.log(error);
    }
}

export async function editRoles(rolesArray) {
    try {
        const payload = { roles: [...rolesArray] }
        await axios.put("/server/roles", rolesArray);
    } catch (error) {
        console.log(error);
    }
}
