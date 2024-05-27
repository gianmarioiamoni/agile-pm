import express from 'express';
import { createBacklogItem, getBacklogItem, getBacklogItems, updateBacklogItem, deleteBacklogItem, updatePriorities } from "../controllers/backlogItem.js";

const router = express.Router();

router.post('/create', createBacklogItem);
router.get('/:id', getBacklogItem);
router.get('/project/:projectId', getBacklogItems);
router.put('/update/:id', updateBacklogItem);
router.put('/projects/:projectId/reorder', updatePriorities);
router.delete('/delete/:id', deleteBacklogItem);

export default router;
