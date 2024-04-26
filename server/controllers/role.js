import Role from "../models/role.js";

export const addRoles = async (req, res) => {
    const roles = new Role(req.body);
    try {
        // if (req.body.name = "default") {
        //     await Role.findOneAndDelete({ name: "current" });
        //     const currentRole = new Role({ name: "current", roles: [...req.body.roles] });
        //     await currentRole.save();
        // }

        await Role.findOneAndDelete({ name: "current" });
        const newRole = await roles.save();
        res.status(201).json(newRole);
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