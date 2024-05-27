import express from 'express';

import { assignTask, getAvailableTasksAndSprintTasks, updateTaskStatus, getTasksBySprintId } from "../controllers/task.js";

const router = express.Router();

// get all available tasks and existing sprints
router.get('/', getAvailableTasksAndSprintTasks);

// get tasks by sprint id
router.get('/sprint/:sprintId', getTasksBySprintId);

// assign a task to a sprint
router.post('/assign', assignTask);


// update the status of a task
router.put('/:taskId/updateStatus', updateTaskStatus);

export default router;


