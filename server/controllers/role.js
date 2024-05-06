import Role from "../models/role.js";

import { getDefaultRoles } from "../Authorizations.js";

export const addRole = async (req, res) => {
    const roleObj = req.body;

    const role = new Role(roleObj);
    try {
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const editRole = async (req, res) => {
    const roleObj = req.body;
    const { id } = req.params;
    try {
        const role = await Role.findOneAndUpdate({ roleId: id }, { roleDescription: roleObj.description })
        // await Role.findOneAndUpdate({ id }, {description} );
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const restoreRoles = async (req, res) => {
    const rolesArray = req.body;

    try {
        await Role.deleteMany({});
        await Role.insertMany(rolesArray);
        res.status(201).json({message: "default roles restored"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        await Role.findOneAndDelete({ roleId: id });
        res.status(201).json({message: "role cancelled"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoles = async (req, res) => {
    const { name } = req.params;
    try {
        if (name === "current") {
            const roles = await Role.find({});
            res.status(201).json(roles);
            return;
        }
        if (name === "default") {
            const roles = getDefaultRoles();
            res.status(201).json(roles);
            return;
        }
        // roles name not recognised
        res.status(400).json({message: "roles name not recognised"})

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};