import Task from "../models/task.js";
import Sprint from "../models/sprint.js";
import BacklogItem from "../models/backlogItem.js";
import Assignment from "../models/assignment.js";

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
    const { title, description, backlogItemId, projectId, assignee } = req.body;

    try {
        const newTask = new Task({ title, description, backlogItemId, projectId, assignee: assignee ? assignee._id : null });
        const savedTask = await newTask.save();

        // Update assignee performance
        if (assignee) {
            await updatePerformance(assignee, projectId);
        }

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
        const oldAssignee = task.assignee;

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignee = assignee || task.assignee;
        const updatedTask = await task.save();
        
        // Update assignee performance
        if (oldAssignee && oldAssignee.toString() !== assignee.toString()) {
            await updatePerformance(oldAssignee, task.projectId);
        }
        if (assignee) {
            await updatePerformance(assignee, task.projectId);
        }

        res.json(task);
    } catch (err) {
        console.log("Error updating task: ", err);
        res.status(500).json({ message: err.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status, backlogItemId } = req.body;

    try {
        const task = await Task.findById(taskId);
        const calculateTaskPoints = (task, oldStatus) => {
            switch (oldStatus) {
                case 'Done':
                    if (status === 'In Progress') {
                        return task.points - 1;
                    } else if (status === 'To Do') {
                        return task.points - 2;
                    } else {
                        return task.points;
                    }
                case 'In Progress':
                    if (status === 'Done') {
                        return task.points + 1;
                    } else if (status === 'To Do') {
                        return task.points - 1;
                    } else {
                        return task.points;
                    }
                case 'To Do':
                    if (status === 'Done') {
                        return task.points + 2;
                    } else if (status === 'In Progress') {
                        return task.points + 1;
                    } else {
                        return task.points;
                    }
                default:
                    return task.points;
            }
        };

        const oldTaskStatus = task.status;
        task.status = status || task.status;
        // calculate updated task points
        task.points = calculateTaskPoints(task, oldTaskStatus);
        const updatedTask = await task.save();

        if (backlogItemId) {
            const backlogItem = await BacklogItem.findById(backlogItemId).populate('tasks');
            const totalTasks = backlogItem.tasks.length;
            const doneTasks = backlogItem.tasks.filter(t => t.status === 'Done').length;

            let newStatus = 'To Do';
            if (doneTasks === totalTasks) {
                newStatus = 'Done';
            } else if (doneTasks > 0) {
                newStatus = 'In Progress';
            }

            // update assignee performance
            if (oldTaskStatus !== status) {
                if (task.assignee) {
                    await updatePerformance(task.assignee, task.projectId);
                }
            }

            // calculate updated backlog item points
            const newBacklogItemPoints = calculateBacklogItemPoints(backlogItem.tasks);

            // check if item status or points have changed and update if necessary
            if (backlogItem.status !== newStatus || backlogItem.points !== newBacklogItemPoints) {
                backlogItem.status = newStatus;
                backlogItem.points = newBacklogItemPoints;

                await backlogItem.save();
            }
        }
        res.status(200).json(task);
    } catch (err) {
        console.log("Error in updateTaskStatus function: ", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateTasksOrder = async (req, res) => {
    const { tasks } = req.body;
    try {
        await Task.updateMany({ _id: { $in: tasks } }, { $set: { order: tasks.indexOf(_id) } });
        res.status(200).json({ message: 'Tasks order updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        const { assignee, projectId } = task;

        await Task.findByIdAndDelete(taskId);

        if (assignee) {
            await updatePerformance(assignee, projectId);
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// INTERNAL UTILITIES

// internal utility functions to update performance on task status change
const updatePerformance = async (userId, projectId) => {
    const tasks = await Task.find({ projectId, assignee: userId });
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    const pendingTasks = tasks.filter(task => task.status !== 'Done').length;
    const performance = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    await Assignment.findOneAndUpdate(
        { userId, projectId },
        { completedTasks, pendingTasks, performance },
        { new: true }
    );
};

// internal utility functions to calculate backlog item points
const calculateBacklogItemPoints = (tasks) => {
    // logic: 1 point for To Do, 2 points for In Progress, 3 points for Done
    // total points = sum of points of all tasks

    // return 0 if no tasks
    if (!tasks || tasks.length === 0) {
        return 0;
    }   

    // return sum of points of all tasks    
    return tasks.reduce((total, task) => total + task.points, 0);
};
    // return tasks.reduce((total, task) => {
    //     switch (task.status) {
    //         case 'To Do':
    //             return total + 1;
    //         case 'In Progress':
    //             return total + 2;
    //         case 'Done':
    //             return total + 3;
    //         default:
    //             return total;
    //     }
    // }, 0);
// };


