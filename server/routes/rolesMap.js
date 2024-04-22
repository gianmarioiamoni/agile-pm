import express from 'express';

import { getRolesMap, createRolesMap, updateRolesMap } from "../controllers/rolesMap.js";

const router = express.Router();

router.get('/:type', getRolesMap);
router.post('/', createRolesMap);
router.put('/:type', updateRolesMap);

export default router;
