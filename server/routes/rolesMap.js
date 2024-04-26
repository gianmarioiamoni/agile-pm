import express from 'express';

import {
    getRolesMap, createRolesMap, updateRolesMap, getPermissionsLabelValues,
    checkCreateProject, checkViewProject, checkEditProject, checkDeleteProject
} from "../controllers/rolesMap.js";

const router = express.Router();

router.get('/permissions-label-values', getPermissionsLabelValues);
router.get('/:name', getRolesMap);
router.post('/', createRolesMap);
router.put('/can-create-project/', checkCreateProject)
router.put('/can-view-project/', checkViewProject)
router.put('/can-edit-project/', checkEditProject)
router.put('/can-delete-project/', checkDeleteProject)
router.put('/:name', updateRolesMap);

export default router;
