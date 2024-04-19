import express from 'express';

import { getUsers, updateUser, deleteUser } from "../controllers/user.js";

import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();

router.get("/", getUsers);
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);

export default router;