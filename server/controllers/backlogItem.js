import BacklogItem from "../models/backlogItem.js";

export const createBacklogItem = async (req, res) => {
    const { projectId, title, description } = req.body;
    try {
        const newItem = new BacklogItem({ projectId, title, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getBacklogItem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await BacklogItem.findById(id);
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getBacklogItems = async (req, res) => {
    const { projectId } = req.params;
    try {
        // const items = await BacklogItem.find({ projectId });
        const items = await BacklogItem.find({ projectId }).populate('tasks');
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateBacklogItem = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    try {
        const updatedItem = await BacklogItem.findByIdAndUpdate(id, { title, description, status, priority }, { new: true });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const addTaskToBacklogItem = async (req, res) => {
    const { id } = req.params;
    const { taskId } = req.body;
    try {
        const item = await BacklogItem.findById(id);
        item.tasks.push(taskId);
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteTaskFromBacklogItem = async (req, res) => {
    const { id } = req.params;
    const { taskId } = req.body;
    try {
        const item = await BacklogItem.findById(id);
        item.tasks.pull(taskId);
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteBacklogItem = async (req, res) => {
    const { id } = req.params;
    try {
        await BacklogItem.findByIdAndDelete(id);
        // res.status(200).json({ message: 'Item del backlog cancellato con successo' });
        res.status(200).json({ success: true, message: 'Backlog item deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePriorities = async (req, res) => {
    const { projectId } = req.params;
    const { items } = req.body;

    try {
        // Verify user permissions here  

        await BacklogItem.bulkWrite(items.map(({ id, priority }) => ({
            updateOne: {
                filter: { _id: id, projectId: projectId },
                update: { priority },
            },
        })));

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error reordering backlog items:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

