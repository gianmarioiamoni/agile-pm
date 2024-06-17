// routes/sprint.js
import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";

import { createSprint, getSprint, getSprintsByProjectId, updateSprint, removeSprint } from "../controllers/sprint.js";

const router = express.Router();

router.post('/', verifyUser, createSprint);
router.get('/:id', verifyUser, getSprint);
router.get('/project/:projectId', verifyUser, getSprintsByProjectId);
router.put('/:id', verifyUser, updateSprint);
router.delete('/:id', verifyUser, removeSprint);

export default router;
