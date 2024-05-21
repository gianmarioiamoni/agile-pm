import Assignment from "../models/assignment.js";


export const saveAssignments = async (req, res) => {
    const { projectId } = req.params;
    const {payload} = req.body;
    const assignments = payload.map((a) => ({userId: a.userId, projectId, roleId: a.roleId}))

    try {
        await Assignment.deleteMany({ projectId });
        const response = Assignment.insertMany(assignments);

        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ projectId: req.params.projectId }).populate('userId').populate('roleId');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





