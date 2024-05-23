import axios from 'axios';

// const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;
const serverUrl = "http://localhost:3000";

export async function getAllProjects() {
    try {
        const projectsListArray = await axios.get('/server/projects');

        return projectsListArray.data;

    } catch (err) { console.log(err) }
}


export async function createProject(newProject) {
    try {
        const payload = { ...newProject };
        const res = await axios.post("/server/projects", payload);

        // id field is added to db by the server
        const returnData = { ...res.data, id: res.data._id };

        return returnData;

    } catch (err) { console.log(err) }
}

export async function updateProject(updatedProject) {
    const id = updatedProject.id;
    try {
        const response = axios.put(`/server/projects/${id}`,
            {...updatedProject}
        );
        return response.data;
    } catch (err) { console.log(err) }
}


export async function getProject(id) {
    try {
        const res = await axios.get(`/server/projects/${id}`);
        return res.data;
    } catch (err) { console.log(err) }
}

export async function removeProject(id) {
    try {
        const res = await axios.delete(`/server/projects/${id}`);
        return res;
    } catch (err) { console.log(err) }
}



