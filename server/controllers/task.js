import Task from "../models/task.js";
import Sprint from "../models/sprint.js";

export const getAvailableTasksAndSprintTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ sprintId: null });
        const sprints = await Sprint.find().populate('tasks');
        res.json({ tasks, sprints });
        return;
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAvailableTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ sprintId: null });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTasksBySprintId = async (req, res) => {
    const { sprintId } = req.params;
    try {
        const tasks = await Task.find({ sprintId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const assignTask = async (req, res) => {
    const { taskId, sprintId } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('Task found');

        if (task.sprintId) {
            // remove task from previous sprint
            await Sprint.findByIdAndUpdate(task.sprintId, { $pull: { tasks: task._id } });
        }

        // update task with the new sprintId
        task.sprintId = sprintId;
        await task.save();

        // add task to the new sprint
        await Sprint.findByIdAndUpdate(sprintId, { $push: { tasks: task._id } });

        res.json({ message: 'Task assigned to sprint' });
        return;
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { taskId, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.status(200).json({ success: true, message: 'Task status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating task status' });
    }
}


