import express from 'express';

import { getRolesMap, createRolesMap, updateRolesMap } from "../controllers/rolesMap.js";

const router = express.Router();

router.get('/:name', getRolesMap);
router.post('/', createRolesMap);
router.put('/:name', updateRolesMap);

export default router;
