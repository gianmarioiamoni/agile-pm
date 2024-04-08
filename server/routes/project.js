// routes/projectRoutes.js
import express from 'express';
const router = express.Router();

import { verifyUser } from "../utils/verifyUser.js";
import { getProjects } from "../controllers/project.js"


// API routes for projects
router.get("/projects", verifyUser, getProjects);

// altre rotte per creare, modificare ed eliminare progetti...

module.exports = router;
