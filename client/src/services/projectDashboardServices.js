import axios from 'axios';
import { getAssignments } from './assignmentServices';

export const fetchProjectData = async (projectId) => {
    try {
        // Fetch project info
        const projectResponse = await axios.get(`/server/projects/${projectId}`);
        const project = projectResponse.data;
        
        // Fetch assignments for the project
        const assignmentsResponse = await axios.get(`/server/assignments/project/${projectId}`);
        const assignments = assignmentsResponse.data;

        // Fetch backlog items for the project
        const backlogResponse = await axios.get(`/server/backlog-items/project/${projectId}`);
        const backlog = backlogResponse.data;

        // Fetch sprints for the project
        const sprintsResponse = await axios.get(`/server/sprints/project/${projectId}`);
        const sprints = sprintsResponse.data;

        // Fetch tasks for each item of the sprint
        for (let sprint of sprints) {

            // for (let item of sprint.items) {
            for (let i = 0; i < sprint.items.length; i++) {
                const item = sprint.items[i];
                if (item._id) {
                    const tasksResponse = await axios.get(`/server/tasks/backlogItems/${item._id}`);
                    const itemWithTasks = { ...item, tasks: tasksResponse.data };
                    sprint.items[i] = itemWithTasks;
                }
            }
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
