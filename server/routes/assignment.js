import express from 'express';
const router = express.Router();

import { createAssignment, getProjectAssignments, updateAssignment, deleteAssignment } from '../controllers/assignment.js';

router.post('/', createAssignment);
router.get('/project/:projectId', getProjectAssignments);
router.patch('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
