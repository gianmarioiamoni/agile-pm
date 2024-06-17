// assignment.js 
import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

import { getAssignments, saveAssignments, getTeamPerformanceReport } from '../controllers/assignment.js';

router.get('/project/:projectId', verifyUser, getAssignments);
router.get('/team-performance-report/:projectId', verifyUser, getTeamPerformanceReport);
router.put('/project/:projectId', verifyUser, saveAssignments);

export default router;
