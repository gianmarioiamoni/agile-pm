import BacklogItem from "../models/backlogItem.js";
import Sprint from "../models/sprint.js";
import Task from "../models/task.js";

/**
 * Retrieves the burndown data for a given project.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export async function getBurndownData(req, res) {
    const { projectId } = req.params;

    try {
        // Retrieve all sprints for the project
        const sprints = await Sprint.find({ projectId });

        const burndownData = [];

        // Iterate over each sprint
        for (const sprint of sprints) {
            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);

            // Retrieve all backlog items for the sprint
            const items = await BacklogItem.find({ sprint: sprint._id });
            const totalPoints = items.reduce((sum, item) => sum + item.points, 0);

            const dailyPoints = [];
            let completedPoints = 0;

            // Calculate the completed points for each day in the sprint
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const day = new Date(d);
                
                // Retrieve all tasks that have been completed on the day
                const tasks = await Task.find({
                    backlogItemId: { $in: items.map(item => item._id) },
                    status: 'Done',
                    updatedAt: { $lte: day }
                });
                
                const completedToday = tasks.reduce((sum, task) => sum + task.points, 0);
                completedPoints += completedToday;

                dailyPoints.push({
                    date: new Date(day),
                    completedPoints,
                    remainingPoints: Math.max(0, totalPoints - completedPoints)
                });
            }

            // Add the sprint information and calculated points to the burndown data
            burndownData.push({
                sprintId: sprint._id,
                sprintName: sprint.name,
                dailyPoints
            });
        }

        // Send the burndown data as the response
        res.json(burndownData);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching burndown data:', error);
        res.status(500).send('Server error');
    }
}
