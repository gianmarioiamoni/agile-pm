import Backlog from "../models/backlog.js";

export const createBacklogItem = async (req, res) => {
    const { projectId, title, description } = req.body;
    try {
        const newItem = new Backlog({ projectId, title, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
};

export const getBacklogItems = async (req, res) => {
    const { projectId } = req.params;
    try {
        const items = await Backlog.find({ projectId });
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateBacklogItem = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    try {
        const updatedItem = await Backlog.findByIdAndUpdate(id, { title, description, status, priority }, { new: true });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteBacklogItem = async (req, res) => {
    const { id } = req.params;
    try {
        await Backlog.findByIdAndDelete(id);
        // res.status(200).json({ message: 'Item del backlog cancellato con successo' });
        res.status(200).json({success: true, message: 'Backlog item deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
