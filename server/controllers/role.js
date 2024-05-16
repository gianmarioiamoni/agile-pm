import Role from "../models/role.js";
import User from "../models/user.js"

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
        const role = await Role.findOneAndUpdate({ roleKey: id }, { roleDescription: roleObj.description })
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const restoreRoles = async (req, res) => {
    const rolesArray = req.body;

    try {
        if (!rolesArray || !Array.isArray(rolesArray)) {
            throw new Error("Invalid roles data provided");
        }

        const defaultRoles = getDefaultRoles();
        if (!defaultRoles || !Array.isArray(defaultRoles)) {
            throw new Error("Default roles data is missing or invalid");
        }

        const currentRoles = await Role.find();
        if (currentRoles.length !== defaultRoles.length) {
            res.status(400).json({ message: "Impossible to restore the roles. There are users with no default roles" });
            return;
        }

        await Role.deleteMany({});
        await Role.insertMany(rolesArray);
        res.status(201).json({ message: "Default roles restored" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteRole = async (req, res) => {
    const { id } = req.params;
    console.log("deleteRole() - id: ", id)
    try {
        // check if there are users with the role
        const users = await User.find({ role: id }).populate('role');
        console.log("Users with the role:", users);

        if (users.length > 0) {
            const roleDescription = users[0].role.roleDescription || "unknown";
            console.log(`Impossible to delete the role. There are ${users.length} users with the ${roleDescription} role`);
            res.json({ success: false, message: `Impossible to delete the role. There are ${users.length} users with the ${roleDescription} role` });
            return;
        }

        // there are no users with the role. We can delete it
        const deletedRole = await Role.findByIdAndDelete(id);
            console.log("Deleted Role:", deletedRole);

        if (!deletedRole) {
            console.log("Role not found");
            res.status(404).json({ message: "Role not found" });
            return;
        }

        console.log("Role deleted successfully");
        res.json({ success: true, message: "Role deleted successfully" });
        return;
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: error.message });
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