import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";

import { getBurndownData } from "../controllers/burndown.js";
const router = express.Router();

router.get('/project/:projectId', verifyUser, getBurndownData);

export default router;
