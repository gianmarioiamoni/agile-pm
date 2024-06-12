import Assignment from "../models/assignment.js";
import User from '../models/user.js';
import Task from '../models/task.js';


export const saveAssignments = async (req, res) => {
    const { projectId } = req.params;
    const {payload} = req.body;
    const assignments = payload.map((a) => ({userId: a.userId, projectId, roleId: a.roleId}))

    try {
        await Assignment.deleteMany({ projectId });
        const response = Assignment.insertMany(assignments);

        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ projectId: req.params.projectId }).populate('userId').populate('roleId');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTeamPerformanceReport = async (req, res) => {
    const { projectId } = req.params;
    try {
        const assignments = await Assignment.find({ projectId }).populate('userId roleId');
        const tasks = await Task.find({ projectId });

        const teamPerformance = assignments.map(assignment => {
            const userTasks = tasks.filter(task => task.assignee.toString() === assignment.userId._id.toString());
            const completedTasks = userTasks.filter(task => task.status === 'Done').length;
            const pendingTasks = userTasks.length - completedTasks;
            const performance = userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0;

            assignment.completedTasks = completedTasks;
            assignment.pendingTasks = pendingTasks;
            assignment.performance = performance;

            return {
                name: assignment.userId.username,
                role: assignment.roleId.name,
                completedTasks,
                pendingTasks,
                performance
            };
        });

        res.status(200).json({ teamMembers: teamPerformance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





