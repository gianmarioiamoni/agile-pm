import express from 'express';

import { verifyUser } from "../utils/verifyUser.js";

import {
    getRolePermissionsMap, createRolesMap, updateRolePermissionsMap, getPermissionsLabelValues,
    checkCreateProject, checkViewProject, checkEditProject, checkDeleteProject, checkAllocateProject,
    checkCreateSprint, checkEditSprint, checkMonitorSprint, checkDeleteSprint, checkParticipateSprint
} from "../controllers/rolesMap.js";

const router = express.Router();

router.get('/permissions-label-values', getPermissionsLabelValues);
router.get('/:name', getRolePermissionsMap);

router.post('/', verifyUser, createRolesMap);

router.put('/check/can-create-project/', checkCreateProject);
router.put('/check/can-view-project/', checkViewProject);
router.put('/check/can-edit-project/', checkEditProject);
router.put('/check/can-delete-project/', checkDeleteProject);
router.put('/check/can-allocate-project/', checkAllocateProject);

router.put('/check/can-create-sprint/', checkCreateSprint);
router.put('/check/can-edit-sprint/', checkEditSprint);
router.put('/check/can-monitor-sprint/', checkMonitorSprint);
router.put('/check/can-delete-sprint/', checkDeleteSprint);
router.put('/check/can-participate-sprint/', checkParticipateSprint);

// must be at the end of the PUT routes
router.put('/:name', verifyUser, updateRolePermissionsMap);

export default router;
