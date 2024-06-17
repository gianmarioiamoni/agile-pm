// backlogItem.js
import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";

import {
    createBacklogItem,
    getBacklogItem,
    getBacklogItems,
    updateBacklogItem,
    deleteBacklogItem,
    updatePriorities,
    addTaskToBacklogItem,
    deleteTaskFromBacklogItem
} from "../controllers/backlogItem.js";

const router = express.Router();

router.post('/create', verifyUser, createBacklogItem);
router.get('/:id', verifyUser, getBacklogItem);
router.get('/project/:projectId', verifyUser, getBacklogItems);
router.put('/update/:id', verifyUser, updateBacklogItem);
router.put('/projects/:projectId/reorder', verifyUser, updatePriorities);
router.put('/addTask/:id', verifyUser, addTaskToBacklogItem);
router.put('/deleteTask/:id', verifyUser, deleteTaskFromBacklogItem);
router.delete('/delete/:id', verifyUser, deleteBacklogItem);

export default router;
