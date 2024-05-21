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

export const updateSprint = async (req, res) => {
    const { id } = req.params;
    const { name, startDate, endDate, goal } = req.body;
    try {
        const updatedSprint = await Sprint.findOneAndUpdate(
            { _id: id },
            { name, startDate, endDate, goal },
            { new: true }
        );
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
