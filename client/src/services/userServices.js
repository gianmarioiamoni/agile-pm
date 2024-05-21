import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";


export async function getCurrentUsers() {
    try {
        const res = await axios.get(`/server/user`);

        const usersArray = res.data.map((u) => ({ ...u, id: u._id }));

        return usersArray;
    } catch (error) {
        console.log(error);
    }
};

export async function deleteUser(id) {
    try {
        const res = await axios.delete(`/server/user/delete/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export async function addUser(user) {
    try {
        const res = await axios.post("/server/user", user);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export async function editUser(user) {
    try {
        const res = await axios.post(`/server/user/update/${user.id}`, user);

        return res;
    } catch (error) {
        console.log(error);
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
    const subject = "AgileProjectManager: new user created";
    const body = `Hello ${username},\n\nA new user has been created for you on AgileProjectManager.\n\nUsername: ${username}\nTemporary Password: ${password}\n\nPlease login and change your password.\n\nBest regards,\nThe AgileProjectManager Team`;

    // Send email
    sendUserEmail(email, subject, body);
};

export const sendResetPwdEmail = (email, username, password) => {
    const subject = "AgileProjectManager: password reset";
    const body = `Hello ${username},\n\nYour password on AgileProjectManager has been reset.\n\nUsername: ${username}\nTemporary Password: ${password}\n\nPlease login and change your password.\n\nBest regards,\nThe AgileProjectManager Team`;

    // Send email
    sendUserEmail(email, subject, body);
};