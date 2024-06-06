import express from 'express';

import { getBurndownData } from "../controllers/burndown.js";
const router = express.Router();

router.get('/project/:projectId', getBurndownData);

export default router;
