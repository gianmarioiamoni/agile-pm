// controllers/sprint.js
import Sprint from "../models/sprint.js";
import BacklogItem from "../models/backlogItem.js";

export const createSprint = async (req, res) => {
    const { name, projectId, startDate, endDate, goal, items } = req.body;
    try {
        const newSprint = new Sprint({ name, projectId, startDate, endDate, goal, items });
        const savedSprint = await newSprint.save();
        await BacklogItem.updateMany(
            { _id: { $in: items } },
            { $set: { sprint: savedSprint._id } }
        );
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
        res.status(200).json(sprints);
    } catch (error) {
        console.log('Error getting sprints by projectId:', error);
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
