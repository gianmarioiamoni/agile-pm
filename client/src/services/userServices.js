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

export async function getDefaultPermissions() {
    const permissionsName = "default";
    try {
        const defaultPermissionsArray = await axios.get(`/server/permissions/${permissionsName}`);

        return defaultPermissionsArray.data.permissions;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentRoles() {
    const roleName = "current";
    try {
        const currentRolesArray = await axios.get(`/server/roles/${roleName}`);
        console.log("currentRolesArray: ", currentRolesArray)

        return currentRolesArray.data.roles;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentPermissions() {
    const permissionName = "current";
    try {
        const currentPermissionsArray = await axios.get(`/server/permissions/${permissionName}`);

        return currentPermissionsArray.data.permissions;
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

export async function createNewPermissions(permissionsObj) {
    try {
        await axios.post("/server/permissions", permissionsObj);
    } catch (error) {
        console.log(error);
    }
}

// USERS

export async function getCurrentUsers() {
    try {
        const res = await axios.get(`/server/user`);

        const usersArray = res.data.map((u) => ({ ...u, id: u._id }));

        return usersArray;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteUser(id) {
    try {
        const res = axios.delete(`/server/user/delete/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export async function addUser(user) {
    try {
        const res = axios.post("/server/user", user)
    } catch (error) {
        console.log(err);
    }
}

function sendUserEmail(email, subject, body) {
    axios.post('/server/user/send-email', {
        to: email,
        subject,
        body
    })
        .then(response => {
            console.log(response);
            alert('Email sent successfully!');
        })
        .catch(error => {
            console.error(error);
            alert('Failed to send email. Please try again later.');
        });
};

export const sendNewUserEmail = (email, username, password) => {
    // Costruisci il contenuto dell'email
    const subject = "AgileProjectManager: new user created";
    const body = `Hello ${username},\n\nA new user has been created for you on AgileProjectManager.\n\nUsername: ${username}\nTemporary Password: ${password}\n\nPlease login and change your password.\n\nBest regards,\nThe AgileProjectManager Team`;

    // Send email
    sendUserEmail(email, subject, body);
    // Qui puoi utilizzare una libreria per inviare l'email, ad esempio Axios per fare una richiesta HTTP a un server che invia l'email, o puoi usare un servizio di invio email come SendGrid o Nodemailer
};