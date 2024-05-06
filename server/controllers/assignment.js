import Assignment from "../models/assignment.js";

export const createAssignment = async (req, res) => {
    try {
        const { userId, projectId, role } = req.body;
        const assignment = new Assignment({ userId, projectId, role });
        await assignment.save();

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ projectId: req.params.projectId }).populate('userId').populate('role');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (req.body.userId != null) {
            assignment.userId = req.body.userId;
        }
        if (req.body.projectId != null) {
            assignment.projectId = req.body.projectId;
        }
        if (req.body.role != null) {
            assignment.role = req.body.role;
        }
        await assignment.save();
        res.json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        await assignment.remove();
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





