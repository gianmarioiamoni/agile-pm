import express from 'express';

import {
    getRolePermissionsMap, createRolesMap, updateRolePermissionsMap, getPermissionsLabelValues,
    checkCreateProject, checkViewProject, checkEditProject, checkDeleteProject, checkAllocateProject
} from "../controllers/rolesMap.js";

const router = express.Router();

router.get('/permissions-label-values', getPermissionsLabelValues);
router.get('/:name', getRolePermissionsMap);
router.post('/', createRolesMap);
router.put('/can-create-project/', checkCreateProject)
router.put('/can-view-project/', checkViewProject)
router.put('/can-edit-project/', checkEditProject)
router.put('/can-delete-project/', checkDeleteProject)
router.put('/can-allocate-project/', checkAllocateProject)
router.put('/:name', updateRolePermissionsMap);

export default router;
