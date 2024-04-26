import express from 'express';

import {
    getRolesMap, createRolesMap, updateRolesMap, getPermissionsLabelValues,
    checkCreateProject
} from "../controllers/rolesMap.js";

const router = express.Router();

router.get('/permissions-label-values', getPermissionsLabelValues);
router.get('/:name', getRolesMap);
router.post('/', createRolesMap);
router.put('/can-create-project/', checkCreateProject)
router.put('/:name', updateRolesMap);

export default router;
