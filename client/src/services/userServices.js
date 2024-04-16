import axios from 'axios';

import {rolesMap} from '../utils/RolesProvider';
// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

// Gets current available roles; if default roles doesn't exist It will create It
// and will set current roles equal to that
export async function getCurrentRoles() {
    try {
        let currentRolesArray;
        const defaultRolesArray = await axios.get("/server/roles", {
                params: {
                    name: "default"
                }
            }
        );
        
        // if default roles don't exists in the db, create it and copy to current roles
        if (!defaultRolesArray) {
            await axios.post("/server/roles", { name: "default", roles: [...rolesMap] });
            currentRolesArray = await axios.post("/server/roles", { name: "current", roles: [...rolesMap] });
        } else {
            currentRolesArray = await axios.get("/server/roles", {
                params: {
                    name: "current"
                }
            });
        }
        
        return currentRolesArray.data.roles;

    } catch (err) { console.log(err) }
}