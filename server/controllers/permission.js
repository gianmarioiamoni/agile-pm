import Permission from "../models/permission.js";

export const addPermissions = async (req, res) => {
    const permissions = new Permission(req.body);
    try {
        if (req.body.name = "default") {
            await Permission.findOneAndDelete({ name: "current" });
            const currentPermission = new Permission({ name: "current", permissions: [...req.body.permissions] });
            await currentPermission.save();
        }
        const newPermission = await permissions.save();
        res.status(201).json(newPermission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPermissions = async (req, res) => {
    const name = req.params.name;
    try {
        const permissions = await Permission.findOne({ name });
        console.log("permissions: ", permissions)
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};