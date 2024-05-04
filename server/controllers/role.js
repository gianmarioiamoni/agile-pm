import Role from "../models/role.js";

export const addRole = async (req, res) => {
    const role = new Role(req.body);
    try {
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const editRole = async (req, res) => {
    const roleObj = req.body;
    const id = req.params;
    try {
        const role = await Role.findOneAndUpdate({ id: roleObj.id }, { description })
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
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteRole = async (req, res) => {
    const roleId = (req.params);
    try {
        await Role.findOneAndDelete({ id: roleId });
        res.status(201).json({message: "role cancelled"});
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