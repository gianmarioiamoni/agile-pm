import Project from "../models/project.js"

export const verifyProject = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    const project = new Project(req.body);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        // delete the project
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            console.log(`Project with id ${id} not found`);
            return res.status(404).json({ message: `Project with id ${id} not found` });
        }
        console.log('Project deleted successfully');
        res.json({ message: 'project deleted successfully' });
    } catch (error) {
        console.log(`Error deleting project with id ${id}: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

