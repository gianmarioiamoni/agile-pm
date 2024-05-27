import express from 'express';

import {
    createTask,
    assignTask,
    getAvailableTasksAndSprintTasks,
    getTasksBySprintId,
    getTasksByBacklogItemId, 
    updateTaskStatus,
} from "../controllers/task.js";

const router = express.Router();

// get all available tasks and existing sprints
router.get('/', getAvailableTasksAndSprintTasks);

// get tasks by sprint id
router.get('/sprint/:sprintId', getTasksBySprintId);

router.get('/backlogItems/:backlogItemId', getTasksByBacklogItemId);

router.post('/', createTask);

// assign a task to a sprint
router.post('/assign', assignTask);


// update the status of a task
router.put('/:taskId/updateStatus', updateTaskStatus);

export default router;


