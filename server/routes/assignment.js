import express from 'express';
const router = express.Router();

import { createAssignment, getAssignments, updateAssignment, deleteAssignment } from '../controllers/assignment.js';

router.post('/', createAssignment);
router.get('/project/:projectId', getAssignments);
router.patch('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
