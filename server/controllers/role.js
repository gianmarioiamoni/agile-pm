import Role from "../models/role.js";

export const addRoles = async (req, res) => {
    const roles = new Role(req.body);
    try {
        await Role.findOneAndDelete({ name: "current" });
        const newRole = await roles.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const editRoles = async (req, res) => {
    const roles = (req.body);
    console.log("editRoles() - roles: ", roles)
    try {
        await Role.findOneAndUpdate({ name: "current" }, {roles: roles} );
        res.status(201).json(roles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoles = async (req, res) => {
    const name = req.params.name;
    try {
        const roles = await Role.findOne({ name });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};