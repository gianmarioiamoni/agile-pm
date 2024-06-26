import RolesMap from "../models/rolesMap.js";

import {
    permissionsLabelValueArray,

    canCreateProject,
    canViewProject,
    canEditProject,
    canDeleteProject,
    canAllocateProject,

    canCreateSprint,
    canEditSprint,
    canMonitorSprint,
    canDeleteSprint,
    canParticipateSprint
} from "../Authorizations.js";


export const getRolePermissionsMap = async (req, res) => {
    const { name } = req.params;
    try {
        const map = await RolesMap.findOne({ name });
        // if (!map) {
        //     return res.status(404).json({ message: `Roles map of type '${name}' not found.` });
        // }
        res.json(map);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRolesMap = async (req, res) => {
    const mapData = req.body;
    try {
        const newMap = new RolesMap(mapData);
        await newMap.save();
        res.status(201).json(newMap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateRolePermissionsMap = async (req, res) => {
    const { name } = req.params;
    const updatedMapData = req.body;
    try {
        const response = await RolesMap.findOneAndUpdate({ name: name }, { roles: updatedMapData })
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPermissionsLabelValues = (req, res) => {
    res.json(permissionsLabelValueArray);
};

export const checkCreateProject = async (req, res) => {
    const user = req.body;
    const resp = await canCreateProject(user);
    res.json(resp);
};

export const checkViewProject = async (req, res) => {
    const user = req.body;
    const resp = await canViewProject(user);
    res.json(resp);
};

export const checkEditProject = async (req, res) => {
    const user = req.body;
    const resp = await canEditProject(user);
    res.json(resp);
};

export const checkDeleteProject = async (req, res) => {
    const user = req.body;
    const resp = await canDeleteProject(user);
    res.json(resp);
};

export const checkAllocateProject = async (req, res) => {
    const user = req.body;
    const resp = await canAllocateProject(user);
    res.json(resp);
};

// Sprint Permissions
export const checkCreateSprint = async (req, res) => {
    const user = req.body;
    const resp = await canCreateSprint(user);
    res.json(resp);
};

export const checkEditSprint = async (req, res) => {
    const user = req.body;
    const resp = await canEditSprint(user);
    res.json(resp);
};  

export const checkMonitorSprint = async (req, res) => {
    const user = req.body;
    const resp = await canMonitorSprint(user);
    res.json(resp);
};      

export const checkDeleteSprint = async (req, res) => {
    const user = req.body;
    const resp = await canDeleteSprint(user);
    res.json(resp);
};  

export const checkParticipateSprint = async (req, res) => {
    const user = req.body;
    const resp = await canParticipateSprint(user);
    res.json(resp);
};



