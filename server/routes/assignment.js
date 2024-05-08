import express from 'express';
const router = express.Router();

import { createAssignment, getAssignments, updateAssignment, deleteAssignment, saveAssignments } from '../controllers/assignment.js';

// router.post('/', createAssignment);
router.get('/project/:projectId', getAssignments);
router.put('/project/:projectId', saveAssignments);
// router.patch('/:id', updateAssignment);
// router.delete('/:id', deleteAssignment);

export default router;
