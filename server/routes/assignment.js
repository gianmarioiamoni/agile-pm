import express from 'express';
const router = express.Router();

import { getAssignments, saveAssignments } from '../controllers/assignment.js';

router.get('/project/:projectId', getAssignments);
router.put('/project/:projectId', saveAssignments);

export default router;
