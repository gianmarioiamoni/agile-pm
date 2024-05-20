// routes/sprint.js
import express from 'express';
import { createSprint, getSprintsByProjectId, updateSprint, removeSprint } from "../controllers/sprint.js";

const router = express.Router();

router.post('/', createSprint);
router.get('/project/:projectId', getSprintsByProjectId);
router.put('/:id', updateSprint);
router.delete('/:id', removeSprint);

export default router;
