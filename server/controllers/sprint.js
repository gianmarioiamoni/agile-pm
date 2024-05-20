// controllers/sprint.js
import Sprint from "../models/sprint.js";

export const createSprint = async (req, res) => {
    const { name, projectId, startDate, endDate, goal } = req.body;
    try {
        const newSprint = new Sprint({ name, projectId, startDate, endDate, goal });
        const savedSprint = await newSprint.save();
        res.status(201).json(savedSprint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSprintsByProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const sprints = await Sprint.find({ projectId });
        res.status(200).json(sprints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
