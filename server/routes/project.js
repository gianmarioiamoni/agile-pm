// routes/projectRoutes.js
import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/project.js";

const router = express.Router();

// API routes for projects
router.get("/projects", verifyUser, getProjects);
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;


