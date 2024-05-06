import express from 'express';

import { getRoles, addRole, editRole, deleteRole, restoreRoles } from "../controllers/role.js";

import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();

router.get("/:name", getRoles);
router.post("/", verifyUser, addRole);
router.put("/", verifyUser, restoreRoles);
router.put("/:id", verifyUser, editRole);
router.delete("/:id", verifyUser, deleteRole);


export default router;
