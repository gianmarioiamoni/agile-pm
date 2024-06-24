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
            console.log("======= fetched items for sprint", sprint.name, items);

            const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
            
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

                // Fetch tasks completed on the day for sprint
                console.log("§§§§§§ fetching tasks on day", new Date(d));
                const tasks = await Task.find({
                    // backlogItemId: { $in: items.map(item => item._id) },
                    projectId,
                    updatedAt: { $gte: startOfDay, $lt: endOfDay }
                });
                console.log("§§§§§§ tasks fetched on day", new Date(d), tasks.length);

                const sprintCompletedTasks = tasks.filter(task => task.backlogItemId  in items.map(item => item._id));
                console.log("fetched tasks on day", new Date(d), tasks.length);

                // Calculate the completed points for the day
                const projectCompletedToday = tasks.reduce((sum, task) => sum + task.points, 0);
                const sprintCompletedToday = sprintCompletedTasks.reduce((sum, task) => sum + task.points, 0);

                sprintCompletedPoints += sprintCompletedToday;
                projectCompletedPoints += projectCompletedToday;
                console.log("project completed points", projectCompletedPoints);
                console.log("********************************");

                // Update daily points array
                sprintDailyPoints.push({
                    date: new Date(day),
                    completedPoints: sprintCompletedPoints,
                    remainingPoints: Math.max(0, totalPoints - sprintCompletedPoints)
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

