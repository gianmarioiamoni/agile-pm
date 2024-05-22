import express from 'express';

import { assignTask, getAvailableTasksAndSprintTasks } from "../controllers/task.js";

const router = express.Router();

// get all available tasks and existing sprints
router.get('/', getAvailableTasksAndSprintTasks);

// assign a task to a sprint
router.post('/assign', assignTask);

export default router;
