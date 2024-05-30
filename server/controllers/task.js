import Task from "../models/task.js";
import Sprint from "../models/sprint.js";
import BacklogItem from "../models/backlogItem.js";

export const getAvailableTasksAndSprintTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ sprintId: null });
        const sprints = await Sprint.find().populate('items');
        // populating sprints items with tasks
        sprints.forEach(sprint => {
            sprint.items.forEach(item => {
                tasks.forEach(task => {
                    if (task._id === item.taskId) {
                        task.sprintId = sprint._id;
                    }
                    if (item.taskId === null) {}
                        task.save();
                });
            });
        });
        res.json({ tasks, sprints });
        return;
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getAvailableTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ sprintId: null }).populate('assignee');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTasksBySprintId = async (req, res) => {
    const { sprintId } = req.params;
    try {
        const tasks = await Task.find({ sprintId }).populate('assignee');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTasksByBacklogItemId = async (req, res) => {
    const { backlogItemId } = req.params;
    try {
        const tasks = await Task.find({ backlogItemId }).populate('assignee');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTask = async (req, res) => {
    const { title, description, backlogItemId, assignee } = req.body;

    try {
        const newTask = new Task({ title, description, backlogItemId, assignee: assignee ? assignee._id : null });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.log("Error in createTask function: ", error);
        res.status(500).json({ error: error.message });
    }
};


export const assignTask = async (req, res) => {
    const { taskId, sprintId } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

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

export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignee } = req.body;
    try {
        const task = await Task.findById(taskId);
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignee = assignee || task.assignee;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status, backlogItemId } = req.body;

    try {
        const task = await Task.findById(taskId);
        task.status = status || task.status;
        await task.save();

        if (backlogItemId) {
            const backlogItem = await BacklogItem.findById(backlogItemId);
            const totalTasks = backlogItem.tasks.length;
            const doneTasks = backlogItem.tasks.filter(t => t.status === 'Done').length;

            let newStatus = 'To Do';
            if (doneTasks === totalTasks) {
                newStatus = 'Done';
            } else if (doneTasks > 0) {
                newStatus = 'In Progress';
            }

            if (backlogItem.status !== newStatus) {
                backlogItem.status = newStatus;
                await backlogItem.save();
            }
        }
        res.status(200).json(task);
    } catch (err) {
        console.log("Error in updateTaskStatus function: ", err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

