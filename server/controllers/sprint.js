// controllers/sprint.js
import Sprint from "../models/sprint.js";
import BacklogItem from "../models/backlogItem.js";
import Task from "../models/task.js";

export const createSprint = async (req, res) => {
    const { name, projectId, startDate, endDate, goal, items } = req.body;
    try {
        const newSprint = new Sprint({ name, projectId, startDate, endDate, goal, items });
        const savedSprint = await newSprint.save();

        // Update tasks with sprint id
        await BacklogItem.updateMany(
            { _id: { $in: items } },
            { $set: { sprint: savedSprint._id } }
        );

        // Calculate completed points
        let completedPoints = 0;
        for (let itemId of items) {
            const tasks = await Task.find({ backlogItemId: itemId, status: 'Done' });
            completedPoints += tasks.reduce((sum, task) => sum + task.points, 0);
        }

        // Update completed points in the sprint
        savedSprint.completedPoints = completedPoints;
        await savedSprint.save();

        res.status(201).json(savedSprint);
    } catch (error) {
        console.log('Error creating sprint:', error);
        res.status(500).json({ error: error.message });
    }
};


export const getSprint = async (req, res) => {
    const { id } = req.params;
    try {
        const sprint = await Sprint.findById(id).populate('items');
        res.status(200).json(sprint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getSprintsByProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const sprints = await Sprint.find({ projectId }).populate('items');
        console.log('sprints', sprints);

        // Calculate completed points for each sprint
        const sprintVelocityData = await Promise.all(sprints.map(async (sprint) => {
            let completedPoints = 0;

            for (let item of sprint.items) {
                const tasks = await Task.find({ backlogItemId: item._id, status: 'Done' });
                completedPoints += tasks.reduce((sum, task) => sum + task.points, 0);
            }

            // update completed points of the sprint in the database
            sprint.completedPoints = completedPoints;
            await sprint.save();

            return {
                sprint: sprint.name,
                velocity: completedPoints
            };
        }));

        res.status(200).json({
            sprints,
            sprintVelocityData
        });
    } catch (error) {
        console.log('Error getting sprints by projectId:', error);
        res.status(500).json({ error: error.message });
    }
};


export const updateSprint = async (req, res) => {
    const { id } = req.params;
    const { name, startDate, endDate, goal, items } = req.body;
    try {
        const updatedSprint = await Sprint.findOneAndUpdate(
            { _id: id },
            { name, startDate, endDate, goal, items },
            { new: true }
        );

        // Calcola i punti completati
        let completedPoints = 0;
        for (let itemId of items) {
            const tasks = await Task.find({ backlogItemId: itemId, status: 'Done' });
            completedPoints += tasks.reduce((sum, task) => sum + task.points, 0);
        }

        // Aggiorna i punti completati nello sprint
        updatedSprint.completedPoints = completedPoints;
        await updatedSprint.save();

        res.status(200).json(updatedSprint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeSprint = async (req, res) => {
    const { id } = req.params;
    try {
        await Sprint.findByIdAndDelete(id);
        res.status(200).json({ message: "Sprint deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
