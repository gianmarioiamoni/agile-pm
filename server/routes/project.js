// routes/project.js
import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/project.js";

const router = express.Router();

// API routes for projects
router.get("/", verifyUser, getProjects);
router.get('/:id', verifyUser, getProject);
router.post('/', verifyUser, createProject);
router.patch('/:id', verifyUser, updateProject);
router.delete('/:id', verifyUser, deleteProject);

export default router;


