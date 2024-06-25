import { get } from "mongoose";
import BacklogItem from "../models/backlogItem.js";
import Sprint from "../models/sprint.js";
import Task from "../models/task.js";

/**
 * Fetches burndown data for a project.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the data is sent
 */
export async function getBurndownData(req, res) {
    const { projectId } = req.params;

    const totalProjectTasks = await Task.find({ projectId });

    try {
        // Fetch sprints for the project
        const sprints = await Sprint.find({ projectId });

        const sprintBurndownData = [];
        const projectBurndownData = [];

        // calculate total project points
        const totalProjectPoints = await getTotalProjectPoints(projectId);

        let projectCompletedPoints = 0;

        // Iterate over each sprint
        for (const sprint of sprints) {
            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);

            // Fetch backlog items for the sprint
            const items = await BacklogItem.find({ sprint: sprint._id });

            // const totalSprintPoints = items.reduce((sum, item) => sum + item.points, 0);
            // calculate total sprint point as number of tasks per each items * 3
            const totalSprintPoints = items.reduce((sum, item) => sum + item.tasks.length * 3, 0);
            
            const sprintDailyPoints = [];
            let sprintCompletedPoints = 0;

            // Iterate over each day in the sprint
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const day = new Date(d);

                // Set the start and end time for the day
                const startOfDay = new Date(day);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(day);
                endOfDay.setHours(23, 59, 59, 999);

                const completedTasksOfTheDay = totalProjectTasks.filter(task => {
                    return task.updatedAt >= startOfDay && task.updatedAt < endOfDay
                })

                // utility function to check if an array contains an ObjectId
                const containsObjectId = (array, id) => {
                    return array.some(arrayId => arrayId.toString() === id.toString());
                };
                const sprintTasks = completedTasksOfTheDay.filter(task => containsObjectId(items.map(item => item._id), task.backlogItemId));

                // Calculate the completed points for the day
                const projectCompletedToday = completedTasksOfTheDay.reduce((sum, task) => sum + task.points, 0);
                const sprintCompletedToday = sprintTasks.reduce((sum, task) => sum + task.points, 0);

                sprintCompletedPoints += sprintCompletedToday;
                projectCompletedPoints += projectCompletedToday;

                // Update daily points array
                sprintDailyPoints.push({
                    date: new Date(day),
                    completedPoints: sprintCompletedPoints,
                    remainingPoints: Math.max(0, totalSprintPoints - sprintCompletedPoints)
                });

                // Update project daily points
                const existingDay = projectBurndownData.find(p => p.date.getTime() === day.getTime());
                if (existingDay) {
                    existingDay.completedPoints = projectCompletedPoints;
                    existingDay.remainingPoints = Math.max(0, totalProjectPoints - projectCompletedPoints);
                } else {
                    projectBurndownData.push({
                        date: new Date(day),
                        completedPoints: projectCompletedPoints,
                        remainingPoints: Math.max(0, totalProjectPoints - projectCompletedPoints)
                    });
                }
            }

            // Update burndown data array
            sprintBurndownData.push({
                sprintId: sprint._id,
                sprintName: sprint.name,
                sprintDailyPoints
            });

            sprintCompletedPoints = 0;
        }

        // Send the data
        console.log('Sending burndown data');
        res.json({ sprints: sprintBurndownData, project: projectBurndownData });
    } catch (error) {
        console.error('Error fetching burndown data:', error);
        res.status(500).send('Server error');
    }
}

const getTotalProjectPoints = async (projectId) => {
    const tasks = await Task.find({ projectId });
    return tasks.length * 3;
};

