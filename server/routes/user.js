// routes/user.js
import express from 'express';

import { getUsers, updateUser, addUser, deleteUser, sendEmail } from "../controllers/user.js";

import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();

router.get("/", getUsers);
router.post("/", verifyUser, addUser)
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.post("/send-email", sendEmail);

export default router;