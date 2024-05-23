import express from 'express';
import { createBacklogItem, getBacklogItems, updateBacklogItem, deleteBacklogItem } from "../controllers/backlog.js";

const router = express.Router();

router.post('/create', createBacklogItem);
router.get('/project/:projectId', getBacklogItems);
router.put('/update/:id', updateBacklogItem);
router.delete('/delete/:id', deleteBacklogItem);

export default router;
