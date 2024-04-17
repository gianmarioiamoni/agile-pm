import express from 'express';

import { getPermissions, addPermissions } from "../controllers/permission.js";

import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();

router.get("/:name", verifyUser, getPermissions);
router.post("/", verifyUser, addPermissions);

export default router;