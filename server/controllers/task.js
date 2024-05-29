import Task from "../models/task.js";
import Sprint from "../models/sprint.js";
import BacklogItem from "../models/backlogItem.js";

export const getAvailableTasksAndSprintTasks = async (req, res) => {
    try {
        console.log('Getting available tasks and sprint tasks...');
        const tasks = await Task.find({ sprintId: null });
        console.log('Found tasks:', tasks);
        console.log(`Found ${tasks.length} tasks`);

        const sprints = await Sprint.find().populate('items');
        console.log(`Found ${sprints.length} sprints`);
        console.log('Populating sprints with tasks...');
        sprints.forEach(sprint => {
            console.log(`${sprint.name} has ${sprint.items.length} items`);
        });
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
        // const tasks = await Task.find({ sprintId: null });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTasksBySprintId = async (req, res) => {
    const { sprintId } = req.params;
    try {
        const tasks = await Task.find({ sprintId }).populate('assignee');
        // const tasks = await Task.find({ sprintId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTasksByBacklogItemId = async (req, res) => {
    const { backlogItemId } = req.params;
    try {
        // const tasks = await Task.find({ backlogItemId }).populate('assignee');
        const tasks = await Task.find({ backlogItemId }).populate('assignee');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTask = async (req, res) => {
    console.log("createTask function is being called");
    const { title, description, sprintId, backlogItemId, assignee } = req.body;
    console.log("req.body is: ", req.body);
    try {
        console.log("req.body is: ", req.body);
        const newTask = new Task({ title, description, sprintId, backlogItemId, assignee });
        console.log("newTask is: ", newTask);
        const savedTask = await newTask.save();
        console.log("savedTask is: ", savedTask);
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
        console.log("Getting task by id: ", taskId);
        const task = await Task.findById(taskId);
        console.log("Found task: ", task);
        task.status = status || task.status;
        console.log("Updating task status to: ", task.status);
        await task.save();

        if (backlogItemId) {
            console.log("Getting backlogItem by id: ", backlogItemId);
            const backlogItem = await BacklogItem.findById(backlogItemId);
            console.log("Found backlogItem: ", backlogItem);

            const totalTasks = backlogItem.tasks.length;
            const doneTasks = backlogItem.tasks.filter(t => t.status === 'Done').length;
            console.log("Total tasks: ", totalTasks);
            console.log("Done tasks: ", doneTasks);

            let newStatus = 'To Do';
            if (doneTasks === totalTasks) {
                newStatus = 'Done';
            } else if (doneTasks > 0) {
                newStatus = 'In Progress';
            }
            console.log("New status: ", newStatus);

            if (backlogItem.status !== newStatus) {
                backlogItem.status = newStatus;
                console.log("Updating backlogItem status to: ", newStatus);
                await backlogItem.save();
            }
        }
        console.log("Returning task: ", task);
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

