import BacklogItem from "../models/backlogItem.js";
import Sprint from "../models/sprint.js";
import Task from "../models/task.js";

export async function getBurndownData(req, res) {
    const { projectId } = req.params;

    try {
        console.log('Fetching sprints for project', projectId);
        const sprints = await Sprint.find({ projectId });
        console.log('Fetched', sprints.length, 'sprints');

        const burndownData = [];
        const projectDailyPoints = [];

        let totalProjectPoints = 0;
        let totalCompletedPoints = 0;

        // Iterate over each sprint
        for (const sprint of sprints) {
            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);

            console.log('Fetching backlog items for sprint', sprint._id);
            const items = await BacklogItem.find({ sprint: sprint._id });
            console.log('Fetched', items.length, 'backlog items');
            const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
            console.log('Total points:', totalPoints);

            totalProjectPoints += totalPoints;
            const dailyPoints = [];
            let completedPoints = 0;

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const day = new Date(d);

                console.log('Fetching tasks completed on', day);
                const tasks = await Task.find({
                    backlogItemId: { $in: items.map(item => item._id) },
                    status: 'Done',
                    updatedAt: { $lte: day }
                });
                console.log('Fetched', tasks.length, 'tasks');

                const completedToday = tasks.reduce((sum, task) => sum + task.points, 0);
                completedPoints += completedToday;
                totalCompletedPoints += completedToday;

                dailyPoints.push({
                    date: new Date(day),
                    completedPoints,
                    remainingPoints: Math.max(0, totalPoints - completedPoints)
                });

                // Update project daily points
                const existingDay = projectDailyPoints.find(p => p.date.getTime() === day.getTime());
                if (existingDay) {
                    existingDay.completedPoints = totalCompletedPoints;
                    existingDay.remainingPoints = Math.max(0, totalProjectPoints - totalCompletedPoints);
                } else {
                    projectDailyPoints.push({
                        date: new Date(day),
                        completedPoints: totalCompletedPoints,
                        remainingPoints: Math.max(0, totalProjectPoints - totalCompletedPoints)
                    });
                }
            }

            burndownData.push({
                sprintId: sprint._id,
                sprintName: sprint.name,
                dailyPoints
            });
        }

        console.log('Sending burndown data');
        res.json({ sprints: burndownData, project: projectDailyPoints });
    } catch (error) {
        console.error('Error fetching burndown data:', error);
        res.status(500).send('Server error');
    }
}

