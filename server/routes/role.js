import express from 'express';

import { getRoles, addRoles, editRoles } from "../controllers/role.js";

import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();

router.get("/:name", getRoles);
router.post("/", verifyUser, addRoles);
router.put("/", verifyUser, editRoles);

export default router;
