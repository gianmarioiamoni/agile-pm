// routes/sprint.js
import express from 'express';
import { createSprint, getSprintsByProjectId } from "../controllers/sprint.js";

const router = express.Router();

router.post('/', createSprint);
router.get('/project/:projectId', getSprintsByProjectId);

export default router;
