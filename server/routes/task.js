import express from 'express';

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
router.get('/', getAvailableTasksAndSprintTasks);

// get tasks by sprint id
router.get('/sprint/:sprintId', getTasksBySprintId);

// get tasks by backlog item id
router.get('/backlogItems/:backlogItemId', getTasksByBacklogItemId);

// create a new task
router.post('/', createTask);

// assign a task to a sprint
router.post('/assign', assignTask);

// update a task
router.put('/:taskId', updateTask);

// update the status of a task
router.put('/:taskId/updateStatus', updateTaskStatus);

// delete a task
router.delete('/:taskId', deleteTask);

export default router;


