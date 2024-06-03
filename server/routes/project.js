// routes/project.js
import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/project.js";

const router = express.Router();

// API routes for projects
router.get("/", getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;


