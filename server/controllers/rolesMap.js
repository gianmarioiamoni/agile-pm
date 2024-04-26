import RolesMap from "../models/rolesMap.js";

import {
    permissionsLabelValueArray,
    canCreateProject,
    canViewProject,
    canEditProject,
    canDeleteProject
} from "../Authorizations.js";


export const getRolesMap = async (req, res) => {
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

export const updateRolesMap = async (req, res) => {
    const { name } = req.params;
    const updatedMapData = req.body;
    try {
        const existingMap = await RolesMap.findOne({ name });
        if (!existingMap) {
            return res.status(404).json({ message: `Roles map of type '${name}' not found.` });
        }
        existingMap.set(updatedMapData);
        await existingMap.save();
        res.json(existingMap);
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



