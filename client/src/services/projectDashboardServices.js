import axios from 'axios';
import { getAssignments } from './assignmentServices';

export const fetchProjectData = async (projectId) => {
    try {
        // Fetch project info
        const projectResponse = await axios.get(`/server/projects/${projectId}`);
        const project = projectResponse.data;
        
        console.log('Fetched project:', project);

        // Fetch assignments for the project
        const assignmentsResponse = await axios.get(`/server/assignments/project/${projectId}`);
        const assignments = assignmentsResponse.data;
        console.log('Fetched assignments:', assignments);

        // Fetch backlog items for the project
        const backlogResponse = await axios.get(`/server/backlog-items/project/${projectId}`);
        const backlog = backlogResponse.data;
        console.log('Fetched backlog:', backlog);

        // Fetch sprints for the project
        const sprintsResponse = await axios.get(`/server/sprints/project/${projectId}`);
        const sprints = sprintsResponse.data;
        console.log('Fetched sprints:', sprints);

        // Fetch tasks for each sprint
        for (let sprint of sprints) {
            const tasksResponse = await axios.get(`/server/tasks/sprint/${sprint._id}`);
            sprint.tasks = tasksResponse.data;
            console.log(`Fetched tasks for sprint ${sprint._id}:`, sprint.tasks);
        }

        return {
            project,
            assignments,
            backlog,
            sprints
        };
    } catch (error) {
        console.error('Error fetching project data:', error);
        throw error;
    }
};
