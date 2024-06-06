import axios from 'axios';

/**
 * Fetches project data including project information, assignments,
 * backlog items, sprints, and burndown chart data.
 *
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Object>} - An object containing the fetched project data
 * @throws {Error} - If there is an error fetching the project data
 */
export const fetchProjectData = async (projectId) => {
    try {
        console.log('Fetching project data for project ID:', projectId);

        // Fetch project info
        const projectResponse = await axios.get(`/server/projects/${projectId}`);
        const project = projectResponse.data;
        console.log('Fetched project data:', project);

        // Fetch assignments for the project
        const assignmentsResponse = await axios.get(`/server/assignments/project/${projectId}`);
        const assignments = assignmentsResponse.data;
        console.log('Fetched assignments:', assignments);

        // Fetch backlog items for the project
        const backlogResponse = await axios.get(`/server/backlog-items/project/${projectId}`);
        const backlog = backlogResponse.data;
        console.log('Fetched backlog items:', backlog);

        // Fetch sprints for the project
        const sprintsResponse = await axios.get(`/server/sprints/project/${projectId}`);
        const sprints = sprintsResponse.data;
        console.log('Fetched sprints:', sprints);

        // Fetch tasks for each item of the sprint
        for (let sprint of sprints) {
            for (let i = 0; i < sprint.items.length; i++) {
                const item = sprint.items[i];
                if (item._id) {
                    // Fetch tasks for the backlog item
                    const tasksResponse = await axios.get(`/server/tasks/backlogItems/${item._id}`);
                    const itemWithTasks = { ...item, tasks: tasksResponse.data };
                    sprint.items[i] = itemWithTasks;
                    console.log('Fetched tasks for backlog item:', itemWithTasks);
                }
            }
        }

        // Fetch burndown chart data
        const burndownResponse = await axios.get(`/server/burndown/project/${projectId}`);
        const burndownData = burndownResponse.data;
        console.log('Fetched burndown data:', burndownData);

        return {
            project, // Project information
            assignments, // Assignments for the project
            backlog, // Backlog items for the project
            sprints, // Sprints for the project
            burndownData // Burndown chart data for the project
        };
    } catch (error) {
        console.error('Error fetching project data:', error);
        throw error;
    }
};
