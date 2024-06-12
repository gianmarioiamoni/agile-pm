// assignment.js 
import express from 'express';
const router = express.Router();

import { getAssignments, saveAssignments, getTeamPerformanceReport } from '../controllers/assignment.js';

router.get('/project/:projectId', getAssignments);
router.get('/team-performance-report/:projectId', getTeamPerformanceReport);
router.put('/project/:projectId', saveAssignments);

export default router;
