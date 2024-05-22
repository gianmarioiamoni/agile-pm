import Task from "../models/task.js";
import Sprint from "../models/sprint.js";

export const getAvailableTasksAndSprintTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ sprintId: null });
        console.log("getAvailableTasksAndSprintTasks() tasks: ", tasks);
        const sprints = await Sprint.find().populate('tasks');
        console.log("getAvailableTasksAndSprintTasks() sprints: ", sprints);
        res.json({ tasks, sprints });
        return;
    } catch (err) {
        console.log("getAvailableTasksAndSprintTasks() error: ", err);
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

export const assignTask = async (req, res) => {
    const { taskId, sprintId } = req.body;

    console.log('assignTask function called with task ID: ', taskId);
    console.log('assignTask function called with sprint ID: ', sprintId);

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            console.log('Task not found');
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('Task found');

        if (task.sprintId) {
            console.log('Task is already assigned to a sprint, removing it...');
            // remove task from previous sprint
            await Sprint.findByIdAndUpdate(task.sprintId, { $pull: { tasks: task._id } });
        }

        console.log('Task removed from previous sprint');

        // update task with the new sprintId
        task.sprintId = sprintId;
        await task.save();

        console.log('Task updated with new sprint ID');

        // add task to the new sprint
        await Sprint.findByIdAndUpdate(sprintId, { $push: { tasks: task._id } });

        console.log('Task added to new sprint');

        res.json({ message: 'Task assigned to sprint' });
    } catch (err) {
        console.log('Error in assignTask function: ', err.message);
        res.status(500).json({ message: err.message });
    }
}


