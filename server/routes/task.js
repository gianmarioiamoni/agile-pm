import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";

import {
    createTask,
    assignTask,
    getAvailableTasksAndSprintTasks,
    getTasksBySprintId,
    getTasksByBacklogItemId, 
    updateTask,
    updateTaskStatus,
    deleteTask,
} from "../controllers/task.js";

const router = express.Router();

// get all available tasks and existing sprints
router.get('/', verifyUser, getAvailableTasksAndSprintTasks);

// get tasks by sprint id
router.get('/sprint/:sprintId', verifyUser, getTasksBySprintId);

// get tasks by backlog item id
router.get('/backlogItems/:backlogItemId', verifyUser, getTasksByBacklogItemId);

// create a new task
router.post('/', verifyUser, createTask);

// assign a task to a sprint
router.post('/assign', verifyUser, assignTask);

// update a task
router.put('/:taskId', verifyUser, updateTask);

// update the status of a task
router.put('/:taskId/updateStatus', verifyUser, updateTaskStatus);

// delete a task
router.delete('/:taskId', verifyUser, deleteTask);

export default router;


