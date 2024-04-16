import Role from "../models/role.js";

export const addRoles = async (req, res) => {
    const roles = new Role(req.body);
    try {
        if (req.body.name = "default") {
            await Role.findOneAndDelete({ name: "current" });
        }
        const newRole = await roles.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoles = async (req, res) => {
    console.log("role.js - getRoles() - req.params ", req.params)
    const name = req.params.name;
    try {
        const roles = await Project.findOne({name});
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};